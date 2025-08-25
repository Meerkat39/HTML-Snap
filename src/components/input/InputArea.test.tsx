import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import InputArea from "./InputArea";

// InputAreaの単体テスト
// - 入力値反映
// - クリアボタン
// - ペーストサニタイズ
// - エラー表示

describe("InputArea", () => {
  it("入力値が反映される", () => {
    const handleChange = jest.fn();
    render(<InputArea value="<div>test</div>" onChange={handleChange} />);
    const textarea = screen.getByLabelText("HTMLコード入力欄");
    fireEvent.change(textarea, { target: { value: "<span>abc</span>" } });
    expect(handleChange).toHaveBeenCalled();
  });

  it("クリアボタンで入力値が空になる", () => {
    let value = "<div>test</div>";
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      value = e.target.value;
    };
    render(<InputArea value={value} onChange={handleChange} />);
    const clearBtn = screen.getByRole("button");
    fireEvent.click(clearBtn);
    expect(value).toBe("");
  });

  it("危険タグをペーストするとサニタイズされる", () => {
    let pasted = "";
    const handlePasteSanitized = (sanitized: string) => {
      pasted = sanitized;
    };
    render(
      <InputArea
        value=""
        onChange={() => {}}
        onPasteSanitized={handlePasteSanitized}
      />
    );
    const textarea = screen.getByLabelText("HTMLコード入力欄");
    fireEvent.paste(textarea, {
      clipboardData: {
        getData: () => "<script>alert('x')</script><div>ok</div>",
      },
    });
    expect(pasted).toContain("<div>ok</div>");
    expect(pasted).not.toContain("<script>");
  });

  it("危険タグ検出時にエラーメッセージが表示される", () => {
    render(
      <InputArea value="<script>alert('x')</script>" onChange={() => {}} />
    );
    expect(screen.getByText(/危険なタグ/)).toBeInTheDocument();
  });

  // validateHtmlはパース不能な場合のみエラーを返す仕様
  // タグ未閉じや入れ子ミスは検出できないため、テストは保留
});
