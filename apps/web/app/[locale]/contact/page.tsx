import { ContactForm } from "@/components/ContactForm/ContactForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | NakenMoto",
};

export default async function ContactPage() {
  return (
    <div className="container-width container-width-page">
      <ContactForm />
    </div>
  );
}
