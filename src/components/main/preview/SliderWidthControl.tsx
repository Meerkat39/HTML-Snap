// プレビュー枠の横幅をスライダーで調整するUIコンポーネント
import React from "react";

interface SliderWidthControlProps {
  width: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

// 横幅(px)をスライダーで調整
const SliderWidthControl: React.FC<SliderWidthControlProps> = ({
  width,
  min = 300,
  max = 1200,
  onChange,
}) => {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="preview-width-slider" className="text-sm">
        横幅:{" "}
      </label>
      <input
        id="preview-width-slider"
        type="range"
        min={min}
        max={max}
        value={width}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-32"
      />
      <span className="text-xs">{width}px</span>
    </div>
  );
};

export default SliderWidthControl;
