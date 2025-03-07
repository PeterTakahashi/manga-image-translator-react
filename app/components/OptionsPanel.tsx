import React from "react";
import { Icon } from "@iconify/react";
import type { TranslatorKey } from "@/types";
import { validTranslators } from "@/types";
import { getTranslatorName } from "@/utils/getTranslatorName";
import { languageOptions } from "@/config";

type Props = {
  detectionResolution: string;
  textDetector: string;
  renderTextDirection: string;
  translator: TranslatorKey;
  targetLanguage: string;
  inpaintingSize: string;
  customUnclipRatio: number;
  customBoxThreshold: number;
  maskDilationOffset: number;
  inpainter: string;

  setDetectionResolution: (val: string) => void;
  setTextDetector: (val: string) => void;
  setRenderTextDirection: (val: string) => void;
  setTranslator: (val: TranslatorKey) => void;
  setTargetLanguage: (val: string) => void;
  setInpaintingSize: (val: string) => void;
  setCustomUnclipRatio: (val: number) => void;
  setCustomBoxThreshold: (val: number) => void;
  setMaskDilationOffset: (val: number) => void;
  setInpainter: (val: string) => void;
};

export const OptionsPanel: React.FC<Props> = ({
  detectionResolution,
  textDetector,
  renderTextDirection,
  translator,
  targetLanguage,
  inpaintingSize,
  customUnclipRatio,
  customBoxThreshold,
  maskDilationOffset,
  inpainter,
  setDetectionResolution,
  setTextDetector,
  setRenderTextDirection,
  setTranslator,
  setTargetLanguage,
  setInpaintingSize,
  setCustomUnclipRatio,
  setCustomBoxThreshold,
  setMaskDilationOffset,
  setInpainter,
}) => {
  return (
    <>
      {/* 上部の設定オプション（1段目） */}
      <div className="flex flex-wrap items-end gap-4">
        {/* Detection Resolution */}
        <div className="flex items-center gap-1" title="Detection resolution">
          <Icon icon="carbon:fit-to-screen" className="text-gray-600" />
          <div className="relative">
            <select
              className="appearance-none bg-transparent border-b border-gray-300 pl-4 pr-7 py-1 outline-none focus:border-blue-500"
              value={detectionResolution}
              onChange={(e) => setDetectionResolution(e.target.value)}
            >
              <option value="1024">1024px</option>
              <option value="1536">1536px</option>
              <option value="2048">2048px</option>
              <option value="2560">2560px</option>
            </select>
            <Icon
              icon="carbon:chevron-down"
              className="absolute top-1 right-1 text-gray-500 pointer-events-none"
            />
          </div>
        </div>

        {/* Text Detector */}
        <div className="flex items-center gap-1" title="Text detector">
          <Icon icon="carbon:search-locate" className="text-gray-600" />
          <div className="relative">
            <select
              className="appearance-none bg-transparent border-b border-gray-300 pl-4 pr-7 py-1 outline-none focus:border-blue-500"
              value={textDetector}
              onChange={(e) => setTextDetector(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="ctd">CTD</option>
              <option value="paddle">Paddle</option>
            </select>
            <Icon
              icon="carbon:chevron-down"
              className="absolute top-1 right-1 text-gray-500 pointer-events-none"
            />
          </div>
        </div>

        {/* Render text direction */}
        <div
          className="flex items-center gap-1"
          title="Render text orientation"
        >
          <Icon icon="carbon:text-align-left" className="text-gray-600" />
          <div className="relative">
            <select
              className="appearance-none bg-transparent border-b border-gray-300 pl-4 pr-7 py-1 outline-none focus:border-blue-500"
              value={renderTextDirection}
              onChange={(e) => setRenderTextDirection(e.target.value)}
            >
              <option value="auto">Auto</option>
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
            </select>
            <Icon
              icon="carbon:chevron-down"
              className="absolute top-1 right-1 text-gray-500 pointer-events-none"
            />
          </div>
        </div>

        {/* Translator */}
        <div className="flex items-center gap-1" title="Translator">
          <Icon icon="carbon:operations-record" className="text-gray-600" />
          <div className="relative">
            <select
              className="appearance-none bg-transparent border-b border-gray-300 pl-4 pr-7 py-1 outline-none focus:border-blue-500"
              value={translator}
              onChange={(e) => setTranslator(e.target.value as TranslatorKey)}
            >
              {validTranslators.map((key) => (
                <option key={key} value={key}>
                  {getTranslatorName(key)}
                </option>
              ))}
            </select>
            <Icon
              icon="carbon:chevron-down"
              className="absolute top-1 right-1 text-gray-500 pointer-events-none"
            />
          </div>
        </div>

        {/* Target Language */}
        <div className="flex items-center gap-1" title="Target language">
          <Icon icon="carbon:language" className="text-gray-600" />
          <div className="relative">
            <select
              className="appearance-none bg-transparent border-b border-gray-300 pl-4 pr-7 py-1 outline-none focus:border-blue-500"
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
            >
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Icon
              icon="carbon:chevron-down"
              className="absolute top-1 right-1 text-gray-500 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* オプション（2段目） */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex items-center gap-1" title="Inpainting Size">
          <Icon icon="carbon:paint-brush" className="text-gray-600" />
          <div className="relative">
            <select
              className="appearance-none bg-transparent border-b border-gray-300 pl-4 pr-7 py-1 outline-none focus:border-blue-500"
              value={inpaintingSize}
              onChange={(e) => setInpaintingSize(e.target.value)}
            >
              <option value="516">516px</option>
              <option value="1024">1024px</option>
              <option value="2048">2048px</option>
              <option value="2560">2560px</option>
            </select>
            <Icon
              icon="carbon:chevron-down"
              className="absolute top-1 right-1 text-gray-500 pointer-events-none"
            />
          </div>
        </div>

        {/* Unclip Ratio */}
        <div className="flex items-center gap-1" title="Unclip Ratio">
          <Icon icon="weui:max-window-filled" className="text-gray-600" />
          <div className="relative">
            <input
              type="number"
              className="appearance-none bg-transparent border-b border-gray-300 pl-2 pr-2 py-1 outline-none focus:border-blue-500 w-20"
              step="0.01"
              value={customUnclipRatio}
              onChange={(e) => setCustomUnclipRatio(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Box Threshold */}
        <div className="flex items-center gap-1" title="Box Threshold">
          <Icon icon="weui:photo-wall-outlined" className="text-gray-600" />
          <div className="relative">
            <input
              type="number"
              className="appearance-none bg-transparent border-b border-gray-300 pl-2 pr-2 py-1 outline-none focus:border-blue-500 w-20"
              step="0.01"
              value={customBoxThreshold}
              onChange={(e) => setCustomBoxThreshold(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Mask Dilation Offset */}
        <div className="flex items-center gap-1" title="Mask Dilation Offset">
          <Icon
            icon="material-symbols:adjust-outline"
            className="text-gray-600"
          />
          <div className="relative">
            <input
              type="number"
              className="appearance-none bg-transparent border-b border-gray-300 pl-2 pr-2 py-1 outline-none focus:border-blue-500 w-20"
              step="1"
              value={maskDilationOffset}
              onChange={(e) => setMaskDilationOffset(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Inpainter */}
        <div className="flex items-center gap-1" title="Inpainter">
          <Icon icon="carbon:paint-brush" className="text-gray-600" />
          <div className="relative">
            <select
              className="appearance-none bg-transparent border-b border-gray-300 pl-4 pr-7 py-1 outline-none focus:border-blue-500 w-28"
              value={inpainter}
              onChange={(e) => setInpainter(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="lama_large">Lama Large</option>
              <option value="lama_mpe">Lama MPE</option>
              <option value="sd">SD</option>
              <option value="none">None</option>
              <option value="original">Original</option>
            </select>
            <Icon
              icon="carbon:chevron-down"
              className="absolute top-1 right-1 text-gray-500 pointer-events-none"
            />
          </div>
        </div>
      </div>
    </>
  );
};
