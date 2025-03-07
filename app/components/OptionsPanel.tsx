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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Detection Resolution */}
        <div className="flex flex-col">
          <label
            htmlFor="detectionResolution"
            className="mb-1 text-sm text-gray-700 font-medium"
          >
            Detection Resolution
          </label>
          <div className="relative">
            <Icon
              icon="carbon:fit-to-screen"
              className="absolute top-1/2 left-2 -translate-y-1/2 text-gray-400"
            />
            <select
              id="detectionResolution"
              className="w-full appearance-none border border-gray-300 rounded pl-8 pr-6 py-1 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
              value={detectionResolution}
              onChange={(e) => setDetectionResolution(e.target.value)}
              title="Detection resolution"
            >
              <option value="1024">1024px</option>
              <option value="1536">1536px</option>
              <option value="2048">2048px</option>
              <option value="2560">2560px</option>
            </select>
          </div>
        </div>

        {/* Text Detector */}
        <div className="flex flex-col">
          <label
            htmlFor="textDetector"
            className="mb-1 text-sm text-gray-700 font-medium"
          >
            Text Detector
          </label>
          <div className="relative">
            <Icon
              icon="carbon:search-locate"
              className="absolute top-1/2 left-2 -translate-y-1/2 text-gray-400"
            />
            <select
              id="textDetector"
              className="w-full appearance-none border border-gray-300 rounded pl-8 pr-6 py-1 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
              value={textDetector}
              onChange={(e) => setTextDetector(e.target.value)}
              title="Text detector"
            >
              <option value="default">Default</option>
              <option value="ctd">CTD</option>
              <option value="paddle">Paddle</option>
            </select>
          </div>
        </div>

        {/* Render text direction */}
        <div className="flex flex-col">
          <label
            htmlFor="renderTextDirection"
            className="mb-1 text-sm text-gray-700 font-medium"
          >
            Render Direction
          </label>
          <div className="relative">
            <Icon
              icon="carbon:text-align-left"
              className="absolute top-1/2 left-2 -translate-y-1/2 text-gray-400"
            />
            <select
              id="renderTextDirection"
              className="w-full appearance-none border border-gray-300 rounded pl-8 pr-6 py-1 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
              value={renderTextDirection}
              onChange={(e) => setRenderTextDirection(e.target.value)}
              title="Render text orientation"
            >
              <option value="auto">Auto</option>
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
            </select>
          </div>
        </div>

        {/* Translator */}
        <div className="flex flex-col">
          <label
            htmlFor="translator"
            className="mb-1 text-sm text-gray-700 font-medium"
          >
            Translator
          </label>
          <div className="relative">
            <Icon
              icon="carbon:operations-record"
              className="absolute top-1/2 left-2 -translate-y-1/2 text-gray-400"
            />
            <select
              id="translator"
              className="w-full appearance-none border border-gray-300 rounded pl-8 pr-6 py-1 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
              value={translator}
              onChange={(e) => setTranslator(e.target.value as TranslatorKey)}
              title="Translator"
            >
              {validTranslators.map((key) => (
                <option key={key} value={key}>
                  {getTranslatorName(key)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Target Language */}
        <div className="flex flex-col">
          <label
            htmlFor="targetLanguage"
            className="mb-1 text-sm text-gray-700 font-medium"
          >
            Target Language
          </label>
          <div className="relative">
            <Icon
              icon="carbon:language"
              className="absolute top-1/2 left-2 -translate-y-1/2 text-gray-400"
            />
            <select
              id="targetLanguage"
              className="w-full appearance-none border border-gray-300 rounded pl-8 pr-6 py-1 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              title="Target language"
            >
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-4">
        {/* Inpainting Size */}
        <div className="flex flex-col">
          <label
            htmlFor="inpaintingSize"
            className="mb-1 text-sm text-gray-700 font-medium"
          >
            Inpainting Size
          </label>
          <div className="relative">
            <Icon
              icon="carbon:paint-brush"
              className="absolute top-1/2 left-2 -translate-y-1/2 text-gray-400"
            />
            <select
              id="inpaintingSize"
              className="w-full appearance-none border border-gray-300 rounded pl-8 pr-6 py-1 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
              value={inpaintingSize}
              onChange={(e) => setInpaintingSize(e.target.value)}
              title="Inpainting size"
            >
              <option value="516">516px</option>
              <option value="1024">1024px</option>
              <option value="2048">2048px</option>
              <option value="2560">2560px</option>
            </select>
          </div>
        </div>

        {/* Unclip Ratio */}
        <div className="flex flex-col">
          <label
            htmlFor="unclipRatio"
            className="mb-1 text-sm text-gray-700 font-medium"
          >
            Unclip Ratio
          </label>
          <div className="relative">
            <Icon
              icon="weui:max-window-filled"
              className="absolute top-1/2 left-2 -translate-y-1/2 text-gray-400"
            />
            <input
              id="unclipRatio"
              type="number"
              step="0.01"
              className="w-full appearance-none border border-gray-300 rounded pl-8 pr-3 py-1 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
              value={customUnclipRatio}
              onChange={(e) => setCustomUnclipRatio(Number(e.target.value))}
              title="Unclip ratio"
            />
          </div>
        </div>

        {/* Box Threshold */}
        <div className="flex flex-col">
          <label
            htmlFor="boxThreshold"
            className="mb-1 text-sm text-gray-700 font-medium"
          >
            Box Threshold
          </label>
          <div className="relative">
            <Icon
              icon="weui:photo-wall-outlined"
              className="absolute top-1/2 left-2 -translate-y-1/2 text-gray-400"
            />
            <input
              id="boxThreshold"
              type="number"
              step="0.01"
              className="w-full appearance-none border border-gray-300 rounded pl-8 pr-3 py-1 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
              value={customBoxThreshold}
              onChange={(e) => setCustomBoxThreshold(Number(e.target.value))}
              title="Box threshold"
            />
          </div>
        </div>

        {/* Mask Dilation Offset */}
        <div className="flex flex-col">
          <label
            htmlFor="maskDilationOffset"
            className="mb-1 text-sm text-gray-700 font-medium"
          >
            Mask Dilation Offset
          </label>
          <div className="relative">
            <Icon
              icon="material-symbols:adjust-outline"
              className="absolute top-1/2 left-2 -translate-y-1/2 text-gray-400"
            />
            <input
              id="maskDilationOffset"
              type="number"
              step="1"
              className="w-full appearance-none border border-gray-300 rounded pl-8 pr-3 py-1 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
              value={maskDilationOffset}
              onChange={(e) => setMaskDilationOffset(Number(e.target.value))}
              title="Mask dilation offset"
            />
          </div>
        </div>

        {/* Inpainter */}
        <div className="flex flex-col">
          <label
            htmlFor="inpainter"
            className="mb-1 text-sm text-gray-700 font-medium"
          >
            Inpainter
          </label>
          <div className="relative">
            <Icon
              icon="carbon:paint-brush"
              className="absolute top-1/2 left-2 -translate-y-1/2 text-gray-400"
            />
            <select
              id="inpainter"
              className="w-full appearance-none border border-gray-300 rounded pl-8 pr-6 py-1 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
              value={inpainter}
              onChange={(e) => setInpainter(e.target.value)}
              title="Inpainter"
            >
              <option value="default">Default</option>
              <option value="lama_large">Lama Large</option>
              <option value="lama_mpe">Lama MPE</option>
              <option value="sd">SD</option>
              <option value="none">None</option>
              <option value="original">Original</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
};
