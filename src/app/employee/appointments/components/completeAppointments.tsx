"use client";
import { useEffect, useState } from "react";
import CardPadronizedComponent from "./cardPadronized";
import { AppointmentsScheduled } from "@/stores/appointment";
import OtherScheduledAppointmentsPadronizedComponent from "./otherAppoitmentsScheduledPadronized";
import CancelAndPdfButtonComponent from "./cancelAndPdfButton";
import PdfOnBoxInsideConteiner from "./PDFonBoxInsideConteiner";

type Data = {
  message: string;
  appointments: AppointmentsScheduled[] | null;
};

type CompleteAppointments = {
  message: string;
  appointments: AppointmentsScheduled[];
};

interface Props {
  endpoint: string;
  title: string;
  summary: string;
  titlePdf: string;
  summaryPdf: string;
  color: string;
  buttons?: {
    cancel: boolean;
    pdf: boolean;
  };
  pdfEndpoint: string;
}

export default function GetAppointmentsComponentPadronized({
  endpoint,
  title,
  titlePdf,
  summaryPdf,
  summary,
  color,
  buttons,
  pdfEndpoint,
}: Props) {
  const [completeAppointments, setCompleteAppointments] =
    useState<CompleteAppointments | null>(null);

  useEffect(() => {
    const getCompleteAppointments = async () => {
      try {
        const response = await fetch(`/api/${endpoint}`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = (await response.json()) as Data;

        if (!response.ok) {
          throw new Error(data.message || "Houve um erro interno");
        }

        console.log("[COMPLETE APPOINTMENTS] : ", data);

        if (!data.appointments) return;

        setCompleteAppointments(data as CompleteAppointments);
      } catch (err) {
        console.log(err);
      }
    };
    getCompleteAppointments();
  }, [endpoint]);
  if (completeAppointments) {
    return (
      <section className="w-full flex flex-col gap-2">
        <CardPadronizedComponent
          title={title}
          arrayOfItems={completeAppointments.appointments}
          to={color}
          my={0}
        />
        <PdfOnBoxInsideConteiner
          color={color}
          pdfEndpoint={pdfEndpoint}
          title={titlePdf}
          summary={summaryPdf}
        />
        <OtherScheduledAppointmentsPadronizedComponent
          title={title}
          summary={summary}
          otherAppointmentsScheduled={completeAppointments.appointments}
          to={color}
        >
          {buttons && (
            <CancelAndPdfButtonComponent
              cancelButton={buttons.cancel}
              pdfButton={buttons.pdf}
            />
          )}
        </OtherScheduledAppointmentsPadronizedComponent>
      </section>
    );
  }
}
