import { config } from "dotenv";
config({ path: ".env.local" });

const serviceKey = process.env.KAPT_SERVICE_KEY;
const sigunguCode = "11110";

const url = `https://apis.data.go.kr/1613000/AptListService4/getSigunguAptList4?serviceKey=${serviceKey}&sigunguCode=${sigunguCode}&numOfRows=5&pageNo=1`;

const res = await fetch(url);
const data = await res.json();

console.log("최상위 키:", Object.keys(data));
console.log(JSON.stringify(data, null, 2));