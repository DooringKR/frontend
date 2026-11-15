"use client";

import { useEffect } from "react";

/**
 * 새 버전이 깔리면 열려 있던 화면을 한 번 새로고침한다(2026-11-15 사용자 「ㅇㅇ」).
 * 앱은 next-pwa(skipWaiting) 라 배포 뒤에도 열려 있던 휴대폰은 새로고침 전까지 옛 화면을 썼다(QA 「주문하기 누르고 첫 페이지… 반영이 안됐어요」 원인).
 *  - 새 서비스 워커가 화면을 넘겨받으면(controllerchange) 새로고침. 처음 설치(원래 담당이 없던 때)는 넘기지 않는다
 *  - 앱으로 돌아올 때마다 새 버전이 있는지 묻는다(update) — 휴대폰은 화면을 오래 열어 두니까
 * 작성 중인 주문은 기기에 저장돼 있어 새로고침해도 남는다. 개발 서버는 서비스 워커가 꺼져 있어 아무 일도 안 한다.
 */
export default function ReloadOnUpdate() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const sw = navigator.serviceWorker;
    const hadController = !!sw.controller;
    let done = false;
    const onChange = () => {
      if (!hadController || done) return;
      done = true;
      window.location.reload();
    };
    const onVisible = () => {
      if (document.visibilityState === "visible") void sw.getRegistration().then((r) => r?.update());
    };
    sw.addEventListener("controllerchange", onChange);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      sw.removeEventListener("controllerchange", onChange);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);
  return null;
}
