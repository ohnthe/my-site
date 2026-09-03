import { config } from "dotenv";
config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

const KAPT_KEY = process.env.KAPT_SERVICE_KEY;
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchAptList(sggCode, pageNo = 1) {
  const url = `https://apis.data.go.kr/1613000/AptListService4/getSigunguAptList4?serviceKey=${KAPT_KEY}&sigunguCode=${sggCode}&numOfRows=100&pageNo=${pageNo}`;
  const res = await fetch(url);
  const data = await res.json();

  const resultCode = data?.response?.header?.resultCode;
  if (resultCode !== "00") {
    console.error(`  ! API 에러 (${sggCode}):`, data?.response?.header?.resultMsg || JSON.stringify(data));
    return { items: [], totalCount: 0 };
  }

  const items = data.response?.body?.items || [];
  const totalCount = data.response?.body?.totalCount || 0;
  return { items, totalCount };
}

async function main() {
  const { data: regions, error } = await supabase
    .from("regions")
    .select("sgg_code, sgg_name, sido_name")
    .in("sido_name", ["서울특별시", "경기도"]);

  if (error) {
    console.error("regions 조회 실패:", error);
    return;
  }

  console.log(`총 ${regions.length}개 시군구 수집 시작...`);

  for (const region of regions) {
    let pageNo = 1;
    let collected = [];
    let totalCount = 0;

    do {
      const { items, totalCount: tc } = await fetchAptList(region.sgg_code, pageNo);
      totalCount = tc;
      collected = collected.concat(items);
      pageNo++;
      await sleep(150);
    } while (collected.length < totalCount && totalCount > 0);

    const uniqueNames = [...new Set(collected.map((c) => c.kaptName).filter(Boolean))];
    const rows = uniqueNames.map((name) => ({
      sgg_code: region.sgg_code,
      complex_name: name,
    }));

    if (rows.length > 0) {
      const { error: insertError } = await supabase
        .from("apartments")
        .upsert(rows, { onConflict: "sgg_code,complex_name", ignoreDuplicates: true });

      if (insertError) {
        console.error(`  ! ${region.sgg_name} 저장 실패:`, insertError.message);
      } else {
        console.log(`✓ ${region.sido_name} ${region.sgg_name}: ${rows.length}개 단지 저장`);
      }
    } else {
      console.log(`- ${region.sido_name} ${region.sgg_name}: 단지 없음`);
    }

    await sleep(200);
  }

  console.log("전체 완료!");
}

main();