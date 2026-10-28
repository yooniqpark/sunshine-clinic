"use client";

import { createContext, useContext } from "react";
import { clinicConfig } from "@/clinic.config";

/* 클라이언트 컴포넌트용 연락처. 값은 [locale]/layout 이 관리자 설정(DB)에서 읽어 넣는다. */

export type ClinicContact = {
  phone: string;
  phoneHref: string;
  kakaoHref: string;
  naverBookingHref: string;
};

const Ctx = createContext<ClinicContact>({
  phone: clinicConfig.contact.phone,
  phoneHref: `tel:${clinicConfig.contact.phone.replace(/[^0-9+]/g, "")}`,
  kakaoHref: clinicConfig.contact.kakaoHref,
  naverBookingHref: clinicConfig.contact.naverBookingHref,
});

export function ClinicContactProvider({
  value,
  children,
}: {
  value: ClinicContact;
  children: React.ReactNode;
}) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useClinicContact = () => useContext(Ctx);
