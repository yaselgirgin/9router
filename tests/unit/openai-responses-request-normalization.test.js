import { describe, expect, it } from "vitest";
import { FORMATS } from "../../open-sse/translator/formats.js";
import { translateRequest } from "../../open-sse/translator/index.js";

describe("OpenAI Responses request normalization", () => {
  it("maps reasoning_effort and strips unsupported sampling params for GPT-6 reasoning", () => {
    const out = translateRequest(
      FORMATS.OPENAI,
      FORMATS.OPENAI_RESPONSES,
      "gpt-6-sol",
      {
        messages: [{ role: "user", content: "hello" }],
        reasoning_effort: "medium",
        temperature: 0.7,
        top_p: 0.9,
        logprobs: true,
        top_logprobs: 3,
      },
      true,
      null,
      "openai",
    );

    expect(out.reasoning).toEqual({ effort: "medium" });
    expect(out.reasoning_effort).toBeUndefined();
    expect(out.temperature).toBeUndefined();
    expect(out.top_p).toBeUndefined();
    expect(out.logprobs).toBeUndefined();
    expect(out.top_logprobs).toBeUndefined();
  });

  it("keeps sampling params when Responses reasoning is explicitly disabled", () => {
    const out = translateRequest(
      FORMATS.OPENAI,
      FORMATS.OPENAI_RESPONSES,
      "gpt-6-sol",
      {
        messages: [{ role: "user", content: "hello" }],
        reasoning_effort: "none",
        temperature: 0.7,
        top_p: 0.9,
      },
      true,
      null,
      "openai",
    );

    expect(out.reasoning).toEqual({ effort: "none" });
    expect(out.reasoning_effort).toBeUndefined();
    expect(out.temperature).toBe(0.7);
    expect(out.top_p).toBe(0.9);
  });
});
