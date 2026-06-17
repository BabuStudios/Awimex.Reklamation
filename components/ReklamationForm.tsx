"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

type FormValues = {
  namn: string;
  email: string;
  foretag: string;
  ordernummer: string;
  artikelnummer: string;
  antal: string;
  beskrivning: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "#555555",
  marginBottom: 7,
};

const baseInputStyle: React.CSSProperties = {
  width: "100%",
  fontFamily: "inherit",
  fontSize: 15,
  fontWeight: 400,
  color: "#111111",
  background: "#ffffff",
  padding: "12px 14px",
  borderRadius: 0,
  outline: "none",
  transition: "border-color 0.15s",
};

const errorTextStyle: React.CSSProperties = {
  margin: "5px 0 0",
  fontSize: 12,
  color: "#cc0000",
};

function inputStyle(hasError: boolean): React.CSSProperties {
  return {
    ...baseInputStyle,
    border: hasError ? "1.5px solid #cc0000" : "1.5px solid #d4d4d4",
  };
}

function textareaStyle(hasError: boolean): React.CSSProperties {
  return {
    ...inputStyle(hasError),
    resize: "vertical",
    minHeight: 128,
    lineHeight: 1.6,
  };
}

export default function ReklamationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      namn: "",
      email: "",
      foretag: "",
      ordernummer: "",
      artikelnummer: "",
      antal: "",
      beskrivning: "",
    },
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Revoke any outstanding object URLs on unmount.
  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;
    const imgs = Array.from(fileList).filter((f) =>
      f.type.startsWith("image/")
    );
    if (imgs.length === 0) return;
    const urls = imgs.map((f) => URL.createObjectURL(f));
    setFiles((prev) => [...prev, ...imgs]);
    setPreviews((prev) => [...prev, ...urls]);
  }, []);

  const removeFile = useCallback((i: number) => {
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[i]);
      return prev.filter((_, idx) => idx !== i);
    });
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_AUTOMATE_URL as string, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }
      setSubmitted(true);
    } catch {
      setSubmitError(
        "Det gick inte att skicka reklamationen. Försök igen senare."
      );
    } finally {
      setIsSubmitting(false);
    }
  });

  if (submitted) {
    return (
      <div
        style={{
          maxWidth: 520,
          margin: "0 auto",
          animation: "fadeIn 0.4s ease both",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e0e0e0",
            borderTop: "3px solid #111111",
            padding: "64px 52px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 62,
              height: 62,
              border: "2px solid #111111",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 28px",
            }}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#111111"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>

          <h2
            style={{
              margin: "0 0 14px",
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "#111111",
            }}
          >
            Reklamation mottagen
          </h2>
          <p
            style={{
              margin: "0 0 32px",
              fontSize: 15,
              color: "#555555",
              lineHeight: 1.7,
            }}
          >
            Tack! Vi har tagit emot din reklamationsanmälan.
          </p>

          <div style={{ borderTop: "1px solid #e8e8e8", paddingTop: 24 }}>
            <p style={{ margin: 0, fontSize: 13, color: "#888888" }}>
              Har du frågor? Kontakta vår kundtjänst.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "0 auto",
        animation: "slideUp 0.35s ease both",
      }}
    >
      {/* Page heading */}
      <div style={{ marginBottom: 36 }}>
        <p
          style={{
            margin: "0 0 10px",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#888888",
          }}
        >
          Awimex — Kundtjänst
        </p>
        <h1
          style={{
            margin: "0 0 14px",
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "#111111",
            lineHeight: 1.1,
          }}
        >
          Reklamationsformulär
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: 15,
            color: "#555555",
            lineHeight: 1.65,
            maxWidth: 520,
          }}
        >
          Fyll i nedanstående formulär för att anmäla en reklamation.
        </p>
      </div>

      {/* Form card */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e0e0e0",
          borderTop: "3px solid #111111",
          padding: "44px 48px 52px",
        }}
      >
        <form onSubmit={onSubmit} noValidate>
          {/* Namn + E-post */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
              marginBottom: 20,
            }}
          >
            <div>
              <label style={labelStyle}>
                Namn <span style={{ color: "#cc0000" }}>*</span>
              </label>
              <input
                type="text"
                placeholder="För- och efternamn"
                style={inputStyle(!!errors.namn)}
                {...register("namn", {
                  validate: (v) => v.trim() !== "" || "Obligatoriskt fält",
                })}
              />
              {errors.namn && (
                <p style={errorTextStyle}>{errors.namn.message}</p>
              )}
            </div>
            <div>
              <label style={labelStyle}>
                E-postadress <span style={{ color: "#cc0000" }}>*</span>
              </label>
              <input
                type="email"
                placeholder="din@epost.se"
                style={inputStyle(!!errors.email)}
                {...register("email", {
                  validate: (v) => {
                    if (v.trim() === "") return "Obligatoriskt fält";
                    if (!EMAIL_REGEX.test(v))
                      return "Ange en giltig e-postadress";
                    return true;
                  },
                })}
              />
              {errors.email && (
                <p style={errorTextStyle}>{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Företag */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>
              Företag <span style={{ color: "#cc0000" }}>*</span>
            </label>
            <input
              type="text"
              placeholder="Företagsnamn"
              style={inputStyle(!!errors.foretag)}
              {...register("foretag", {
                validate: (v) => v.trim() !== "" || "Obligatoriskt fält",
              })}
            />
            {errors.foretag && (
              <p style={errorTextStyle}>{errors.foretag.message}</p>
            )}
          </div>

          {/* Ordernummer + Artikelnummer + Antal */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 20,
              marginBottom: 20,
            }}
          >
            <div>
              <label style={labelStyle}>
                Ordernr / Fakturanr <span style={{ color: "#cc0000" }}>*</span>
              </label>
              <input
                type="text"
                placeholder="t.ex. 12345"
                style={inputStyle(!!errors.ordernummer)}
                {...register("ordernummer", {
                  validate: (v) => v.trim() !== "" || "Obligatoriskt fält",
                })}
              />
              {errors.ordernummer && (
                <p style={errorTextStyle}>{errors.ordernummer.message}</p>
              )}
            </div>
            <div>
              <label style={labelStyle}>
                Artikelnummer / Produkt{" "}
                <span style={{ color: "#cc0000" }}>*</span>
              </label>
              <input
                type="text"
                placeholder="t.ex. AW-2034"
                style={inputStyle(!!errors.artikelnummer)}
                {...register("artikelnummer", {
                  validate: (v) => v.trim() !== "" || "Obligatoriskt fält",
                })}
              />
              {errors.artikelnummer && (
                <p style={errorTextStyle}>{errors.artikelnummer.message}</p>
              )}
            </div>
            <div>
              <label style={labelStyle}>
                Antal <span style={{ color: "#cc0000" }}>*</span>
              </label>
              <input
                type="number"
                min={1}
                placeholder="0"
                style={inputStyle(!!errors.antal)}
                {...register("antal", {
                  validate: (v) =>
                    v.toString().trim() !== "" || "Obligatoriskt fält",
                })}
              />
              {errors.antal && (
                <p style={errorTextStyle}>{errors.antal.message}</p>
              )}
            </div>
          </div>

          {/* Beskrivning */}
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>
              Beskrivning av felet <span style={{ color: "#cc0000" }}>*</span>
            </label>
            <textarea
              rows={5}
              placeholder="Beskriv felet i detalj — när det uppstod, under vilka omständigheter och vad som inträffade."
              style={textareaStyle(!!errors.beskrivning)}
              {...register("beskrivning", {
                validate: (v) => v.trim() !== "" || "Beskriv felet",
              })}
            />
            {errors.beskrivning && (
              <p style={errorTextStyle}>{errors.beskrivning.message}</p>
            )}
          </div>

          {/* File upload */}
          <div style={{ marginBottom: 40 }}>
            <label style={labelStyle}>Bilder på felet</label>

            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                handleFiles(e.dataTransfer.files);
              }}
              style={{
                border: dragOver
                  ? "2px dashed #111111"
                  : "2px dashed #cccccc",
                background: dragOver ? "#f5f5f5" : "#fafafa",
                padding: "32px 24px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <div style={{ pointerEvents: "none" }}>
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#aaaaaa"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ display: "block", margin: "0 auto 10px" }}
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <p
                  style={{
                    margin: "0 0 4px",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#444444",
                  }}
                >
                  Klicka eller dra bilder hit
                </p>
                <p style={{ margin: 0, fontSize: 12, color: "#999999" }}>
                  PNG, JPG, WEBP — max 10 MB per fil
                </p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFiles(e.target.files)}
              style={{ display: "none" }}
            />

            {previews.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  marginTop: 12,
                }}
              >
                {previews.map((url, i) => (
                  <div
                    key={url}
                    style={{
                      position: "relative",
                      width: 80,
                      height: 80,
                      border: "1px solid #dddddd",
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        backgroundImage: `url(${url})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      aria-label="Ta bort bild"
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: 22,
                        height: 22,
                        background: "rgba(0,0,0,0.75)",
                        color: "#ffffff",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 16,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 0,
                        lineHeight: 1,
                        fontFamily: "sans-serif",
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: 28,
              borderTop: "1px solid #e8e8e8",
            }}
          >
            <p style={{ margin: 0, fontSize: 12, color: "#999999" }}>
              <span style={{ color: "#cc0000" }}>*</span> Obligatoriska fält
            </p>

            <div style={{ textAlign: "right" }}>
              {submitError && (
                <p
                  style={{
                    margin: "0 0 10px",
                    fontSize: 12,
                    color: "#cc0000",
                  }}
                >
                  {submitError}
                </p>
              )}
              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Skickar..." : "Skicka reklamation"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
