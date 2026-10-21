"use client";

import { type FormEvent, useState } from "react";

type AgentMode = "liquid" | "product";

export default function Home() {
  const [mode, setMode] = useState<AgentMode>("liquid");
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!input.trim() || loading) return;

    setLoading(true);
    setAnswer("");
    setError("");

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mode, input }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "The request failed.");
      }

      setAnswer(data.answer);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  const placeholder =
    mode === "liquid"
      ? `Paste your Shopify Liquid code here...

Example:
{% for product in collection.products %}
  {{ product.title }}
{% endfor %}`
      : `Enter your product details here...

Product name:
Features:
Material:
Target audience:
Tone of voice:`;

  return (
    <main className='dashboard'>
      <header className='topbar'>
        <a className='brand' href='/'>
          <span className='brand-icon'>S</span>
          Shopify AI Dev
        </a>

        <span className='local-badge'>
          <span className='status-dot' />
          Local AI
        </span>
      </header>

      <section className='hero'>
        <p className='eyebrow'>YOUR DEVELOPMENT WORKSPACE</p>

        <h1>
          Shopify development,
          <br />
          <span>with AI assistance.</span>
        </h1>

        <p className='hero-description'>
          Audit Liquid code, identify potential bugs, and generate product
          content using your local AI model.
        </p>
      </section>

      <section className='workspace'>
        <div className='mode-switch'>
          <button
            type='button'
            className={mode === "liquid" ? "mode active" : "mode"}
            onClick={() => {
              setMode("liquid");
              setAnswer("");
              setError("");
            }}
          >
            Liquid Code Auditor
          </button>

          <button
            type='button'
            className={mode === "product" ? "mode active" : "mode"}
            onClick={() => {
              setMode("product");
              setAnswer("");
              setError("");
            }}
          >
            Product Content
          </button>
        </div>

        <form onSubmit={handleSubmit} className='agent-form'>
          <label htmlFor='agent-input'>
            {mode === "liquid"
              ? "Paste your Liquid code"
              : "Enter product information"}
          </label>

          <textarea
            id='agent-input'
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={placeholder}
            rows={11}
            maxLength={20000}
            required
          />

          <div className='form-footer'>
            <span>{input.length.toLocaleString()} / 20,000</span>

            <button
              type='submit'
              className='submit-button'
              disabled={loading || !input.trim()}
            >
              {loading
                ? "AI is working..."
                : mode === "liquid"
                  ? "Analyze code"
                  : "Generate content"}
            </button>
          </div>
        </form>

        {loading && (
          <div className='notice'>
            The local model is generating a response. The first request may take
            a little longer.
          </div>
        )}

        {error && (
          <section className='result error-result' role='alert'>
            <h2>Request Failed</h2>
            <p>{error}</p>
          </section>
        )}

        {answer && (
          <section className='result' aria-live='polite'>
            <div className='result-heading'>
              <div>
                <p className='eyebrow'>AGENT RESPONSE</p>
                <h2>
                  {mode === "liquid" ? "Code Analysis" : "Generated Content"}
                </h2>
              </div>

              <button
                type='button'
                className='copy-button'
                onClick={() => {
                  void navigator.clipboard.writeText(answer);
                }}
              >
                Copy Result
              </button>
            </div>

            <pre className='answer'>{answer}</pre>

            <p className='disclaimer'>
              Review and test all AI-generated output before using it. Do not
              publish generated code or product claims without verifying their
              accuracy.
            </p>
          </section>
        )}
      </section>

      <footer className='footer'>
        Shopify development, with AI assistance.
      </footer>
    </main>
  );
}
