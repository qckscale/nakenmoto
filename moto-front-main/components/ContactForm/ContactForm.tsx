"use client";

import { FormEvent, useState } from "react";
import styles from "./ContactForm.module.scss";
import { contact } from "@/lib/sanity";
import { translate } from "@/lib/utils/lang/translate";
import { usePathname } from "next/navigation";

interface ContactFormProps {
  services: any[];
}
export function ContactForm({ services }: ContactFormProps) {
  const pathname = usePathname();
  const locale = pathname.startsWith("/en") ? "en" : "sv";
  const [isSending, setIsSending] = useState(false);
  const [successful, setSuccessful] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const performContact = async (ev: FormEvent<HTMLFormElement>) => {
    setSuccessful(false);
    ev.preventDefault();
    setIsSending(true);

    setTimeout(() => {
      setSuccessful(true);
    }, 100);
    await contact(form).then(() => setSuccessful(true));
    setIsSending(false);
  };
  return (
    <>
      <section className={styles.contactForm}>
        <div className="container-width">
          <h2 className="heading-2">{translate("contact", locale)}</h2>

          <div className={styles.sectionWrapper}>
            {successful ? (
              <p className={styles.submitSuccess}>
                {translate(
                  "thank_you_for_contacting_us_we_will_reach_back_to_you_as_soon_as_possible",
                  locale
                )}
              </p>
            ) : (
              <form onSubmit={performContact} className={styles.contactFormForm}>
                <div className={styles.contactFormInput}>
                  <label htmlFor="name">{translate("full_name", locale)}</label>
                  <input
                    onChange={(ev) =>
                      setForm({ ...form, name: ev.target.value })
                    }
                    required
                    type="text"
                    id="name"
                  />
                </div>
                <div className={styles.contactFormInput}>
                  <label htmlFor="email">{translate("email", locale)}</label>
                  <input
                    onChange={(ev) =>
                      setForm({ ...form, email: ev.target.value })
                    }
                    required
                    type="email"
                    id="email"
                  />
                </div>
                <div className={styles.contactFormInput}>
                  <label htmlFor="subject">
                    {translate("what_can_we_help_with", locale)}
                  </label>
                  <select
                    id="subject"
                    required
                    onChange={(ev) => {
                      setForm({ ...form, subject: ev.target.value });
                    }}
                  >
                    <option value=""></option>
                    <option value={translate("other", locale)}>
                      {translate("other", locale)}
                    </option>
                    {services.map((service: any) => (
                      <option key={service.title} value={service.title}>
                        {service.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.contactFormInput}>
                  <label htmlFor="message">
                    {translate("message", locale)}
                  </label>
                  <textarea
                    onChange={(ev) =>
                      setForm({ ...form, message: ev.target.value })
                    }
                    required
                    id="message"
                  ></textarea>
                </div>
                <button
                  disabled={isSending}
                  type="submit"
                  className="primary fullwidth"
                >
                  {translate("contact", locale)}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
