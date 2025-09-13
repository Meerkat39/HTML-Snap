import React from "react";
import ActionButtons from "./ActionButtons";
import RegionCopyButton from "./RegionCopyButton";
import SliderWidthControl from "./SliderWidthControl";
import ZoomControls from "./ZoomControls";

/**
 * プレビューペインのヘッダー部（スライダー・ズーム・アクションボタン群）
 * @param previewWidth プレビュー枠の横幅
 * @param paneMaxWidth プレビューペインの最大幅
 * @param setPreviewWidth 横幅変更関数
 * @param setZoom ズーム倍率変更関数
 * @param onImageCopy 全体画像コピー関数
 * @param onRegionImageCopy 選択領域画像コピー関数
 * @param selectedRegion 選択領域HTML
 */
type PreviewPaneHeaderProps = {
  previewWidth: number;
  paneMaxWidth: number;
  setPreviewWidth: (w: number) => void;
  setZoom: (z: number) => void;
  onImageCopy: () => void;
  onRegionImageCopy: () => void;
  selectedRegion: string | null;
};

const PreviewPaneHeader: React.FC<PreviewPaneHeaderProps> = ({
  previewWidth,
  paneMaxWidth,
  setPreviewWidth,
  setZoom,
  onImageCopy,
  onRegionImageCopy,
  selectedRegion,
}) => (
  <div className="bg-gray-50 px-2 sm:px-6 py-4 border-b border-gray-200 min-w-0 min-h-[120px] flex items-center">
    <div className="grid grid-cols-2 grid-rows-2 gap-x-4 gap-y-2 items-center w-full">
      {/* 1列目・1行目: スライダー */}
      <div className="col-start-1 row-start-1 flex justify-center items-center w-full">
        <SliderWidthControl
          width={previewWidth}
          max={paneMaxWidth}
          onChange={setPreviewWidth}
        />
      </div>
      {/* 1列目・2行目: zoom */}
      <div className="col-start-1 row-start-2 flex justify-center items-center w-full">
        <ZoomControls onZoomChange={setZoom} />
      </div>
      {/* 2列目: アイコン群（2行中央・縦並び） */}
      <div className="col-start-2 row-span-2 flex flex-col justify-center items-center h-full">
        <div className="flex flex-row justify-center items-center h-full gap-4">
          <ActionButtons
            onImageCopy={onImageCopy}
            buttonClassName="!px-3 !py-2 !text-lg !min-w-[40px]"
            iconSize={28}
          />
          <RegionCopyButton
            onClick={onRegionImageCopy}
            disabled={!selectedRegion}
          />
        </div>
      </div>
    </div>
  </div>
);

export default PreviewPaneHeader;
