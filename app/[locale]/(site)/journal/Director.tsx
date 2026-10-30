import Image from "next/image";
import s from "./journal.module.css";

export default function Director() {
  return <aside className={s.director}>
    <Image src="/team/kim.jpg" alt="선샤인의원 김병현 대표원장" width={400} height={500} className={s.portrait} />
    <span className={s.eyebrow}>A NOTE FROM YOUR DOCTOR</span>
    <h2>김병현 대표원장</h2><p>선샤인의원 · 진료 이야기</p>
    <div className={s.directorNote}><p>유행보다 나에게 맞는 방향을.<br />진료실에서 나누는 이야기를<br />이곳에서도 이어갑니다.</p></div>
  </aside>;
}
