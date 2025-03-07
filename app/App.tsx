import React, { useState, useEffect, useCallback } from "react";
import type { StatusKey, TranslatorKey } from "@/types";
import { validTranslators } from "@/types";

function getTranslatorName(key: TranslatorKey): string {
  if (key === "none") return "No Text";
  return key[0].toUpperCase() + key.slice(1);
}

const BASE_URI = "http://127.0.0.1:8000/"; // API のベースパス (適宜変更)

export const App: React.FC = () => {
  // アップロードファイル/結果格納
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<Blob | null>(null);

  // ステータス管理
  const [status, setStatus] = useState<StatusKey>(null);
  const [queuePos, setQueuePos] = useState<string | null>(null);
  const [progress, setProgress] = useState<string | null>(null);

  // ステータス表示のキャッシュ（切り替えの度に更新）
  const [cachedStatusText, setCachedStatusText] = useState("");

  // 翻訳オプション系
  const [detectionResolution, setDetectionResolution] = useState("1536");
  const [textDetector, setTextDetector] = useState("default");
  const [renderTextDirection, setRenderTextDirection] = useState("auto");
  const [translator, setTranslator] = useState<TranslatorKey>("youdao");
  const [targetLanguage, setTargetLanguage] = useState("CHS");

  const [inpaintingSize, setInpaintingSize] = useState("2048");
  const [customUnclipRatio, setCustomUnclipRatio] = useState<number>(2.3);
  const [customBoxThreshold, setCustomBoxThreshold] = useState<number>(0.7);
  const [maskDilationOffset, setMaskDilationOffset] = useState<number>(30);
  const [inpainter, setInpainter] = useState("default");

  // 画像プレビュー用 URL
  const fileUri = file ? URL.createObjectURL(file) : null;
  // 翻訳後の画像表示用 URL
  const resultUri = result ? URL.createObjectURL(result) : null;

  // エラー状態か判定
  const error = status?.startsWith("error");

  // ステータス文言のリアルタイム値
  const _statusText = (() => {
    switch (status) {
      case "upload":
        return progress ? `Uploading (${progress})` : "Uploading";
      case "pending":
        return queuePos
          ? `Queuing, your position is ${queuePos}`
          : "Processing";
      case "detection":
        return "Detecting texts";
      case "ocr":
        return "Running OCR";
      case "mask-generation":
        return "Generating text mask";
      case "inpainting":
        return "Running inpainting";
      case "upscaling":
        return "Running upscaling";
      case "translating":
        return "Translating";
      case "rendering":
        return "Rendering translated texts";
      case "finished":
        return "Downloading image";
      case "error":
        return "Something went wrong, please try again";
      case "error-upload":
        return "Upload failed, please try again";
      case "error-lang":
        return "Your target language is not supported by the chosen translator";
      case "error-translating":
        return "Did not get any text back from the text translation service";
      case "error-too-large":
        return "Image size too large (greater than 8000x8000 px)";
      case "error-disconnect":
        return "Lost connection to server";
      default:
        return "";
    }
  })();

  // 実際に表示させるステータスはキャッシュ経由
  const statusText = (() => {
    if (_statusText && _statusText !== cachedStatusText) {
      setCachedStatusText(_statusText);
    }
    return cachedStatusText;
  })();

  /** フォーム再セット */
  const clearForm = useCallback(() => {
    setFile(null);
    setResult(null);
    setStatus(null);
    setProgress(null);
    setQueuePos(null);
  }, []);

  /** ドラッグ＆ドロップ対応 */
  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer?.files?.[0];
    if (
      droppedFile &&
      ["image/png", "image/jpeg", "image/bmp", "image/webp"].includes(
        droppedFile.type
      )
    ) {
      setFile(droppedFile);
    }
  }, []);

  /** ファイル選択時 */
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0];
      if (
        selected &&
        ["image/png", "image/jpeg", "image/bmp", "image/webp"].includes(
          selected.type
        )
      ) {
        setFile(selected);
      }
    },
    []
  );

  /** クリップボード ペースト対応 */
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items || [];
      for (const item of items) {
        if (item.kind === "file") {
          const pastedFile = item.getAsFile();
          if (
            pastedFile &&
            ["image/png", "image/jpeg", "image/bmp", "image/webp"].includes(
              pastedFile.type
            )
          ) {
            setFile(pastedFile);
            break;
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste as EventListener);
    return () =>
      window.removeEventListener("paste", handlePaste as EventListener);
  }, []);

  /**
   * フォーム送信 (翻訳リクエスト)
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!file) return;

      setStatus("upload");
      setProgress(null);
      setQueuePos(null);
      setResult(null);

      // フォームデータ作成
      const formData = new FormData();
      formData.append("image", file);

      const config = `{
        "detector": {
          "detector": "${textDetector}",
          "detection_size": ${detectionResolution},
          "box_threshold": ${customBoxThreshold},
          "unclip_ratio": ${customUnclipRatio}
        },
        "render": {
          "direction": "${renderTextDirection}"
        },
        "translator": {
          "translator": "${translator}",
          "target_lang": "${targetLanguage}"
        },
        "inpainter": {
          "inpainter": "${inpainter}",
          "inpainting_size": ${inpaintingSize}
        },
        "mask_dilation_offset": ${maskDilationOffset}
      }`;

      formData.append("config", config);

      // ストリーム処理用にバッファを用意
      let buffer = new Uint8Array();

      const processChunk = (value: Uint8Array) => {
        if (error) return; // 既にエラーの場合は続行しない

        const newBuffer = new Uint8Array(buffer.length + value.length);
        newBuffer.set(buffer);
        newBuffer.set(value, buffer.length);
        buffer = newBuffer;

        while (buffer.length >= 5) {
          // [0]: statusCode, [1..4]: dataSize (Big Endian)
          const dataSize = new DataView(buffer.buffer).getUint32(1, false);
          const totalSize = 5 + dataSize;
          if (buffer.length < totalSize) {
            break;
          }

          const statusCode = buffer[0];
          const data = buffer.slice(5, totalSize);
          const decoder = new TextDecoder("utf-8");

          switch (statusCode) {
            case 0:
              // 結果画像 (PNG)
              setResult(new Blob([data], { type: "image/png" }));
              setStatus(null);
              break;
            case 1:
              // ステータス文字列
              setStatus(decoder.decode(data) as StatusKey);
              break;
            case 2:
              // エラー
              setStatus("error");
              console.error(decoder.decode(data));
              break;
            case 3:
              // キュー内順位
              setStatus("pending");
              setQueuePos(decoder.decode(data));
              break;
            case 4:
              // キュークリア
              setStatus("pending");
              setQueuePos(null);
              break;
            default:
              break;
          }

          buffer = buffer.slice(totalSize);
        }
      };

      try {
        const response = await fetch(
          `${BASE_URI}translate/with-form/image/stream`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.status !== 200) {
          setStatus("error-upload");
          // 元コードに合わせて
          setStatus("pending");
          return;
        }

        // ストリーミング読み込み
        const reader = response.body?.getReader();
        if (!reader) return;

        while (true) {
          const { done, value } = await reader.read();
          if (done || !value) break;
          processChunk(value);
        }
      } catch (err) {
        console.error(err);
        setStatus("error-disconnect");
      }
    },
    [
      file,
      textDetector,
      detectionResolution,
      customBoxThreshold,
      customUnclipRatio,
      renderTextDirection,
      translator,
      targetLanguage,
      inpainter,
      inpaintingSize,
      maskDilationOffset,
      error,
    ]
  );

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center py-8 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-4xl space-y-6"
      >
        <h1 className="text-center text-2xl font-bold text-gray-800">
          Manga/Webtoon Translator
        </h1>

        {/* 上部の設定オプション（1段目） */}
        <div className="flex flex-wrap items-end gap-4">
          {/* Detection Resolution */}
          <div className="flex items-center gap-1" title="Detection resolution">
            <i
              className="iconify text-gray-600"
              data-icon="carbon:fit-to-screen"
            ></i>
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
              <i
                className="iconify absolute top-1 right-1 text-gray-500 pointer-events-none"
                data-icon="carbon:chevron-down"
              ></i>
            </div>
          </div>

          {/* Text Detector */}
          <div className="flex items-center gap-1" title="Text detector">
            <i
              className="iconify text-gray-600"
              data-icon="carbon:search-locate"
            ></i>
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
              <i
                className="iconify absolute top-1 right-1 text-gray-500 pointer-events-none"
                data-icon="carbon:chevron-down"
              ></i>
            </div>
          </div>

          {/* Render text direction */}
          <div
            className="flex items-center gap-1"
            title="Render text orientation"
          >
            <i
              className="iconify text-gray-600"
              data-icon="carbon:text-align-left"
            ></i>
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
              <i
                className="iconify absolute top-1 right-1 text-gray-500 pointer-events-none"
                data-icon="carbon:chevron-down"
              ></i>
            </div>
          </div>

          {/* Translator */}
          <div className="flex items-center gap-1" title="Translator">
            <i
              className="iconify text-gray-600"
              data-icon="carbon:operations-record"
            ></i>
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
              <i
                className="iconify absolute top-1 right-1 text-gray-500 pointer-events-none"
                data-icon="carbon:chevron-down"
              ></i>
            </div>
          </div>

          {/* Target Language */}
          <div className="flex items-center gap-1" title="Target language">
            <i
              className="iconify text-gray-600"
              data-icon="carbon:language"
            ></i>
            <div className="relative">
              <select
                className="appearance-none bg-transparent border-b border-gray-300 pl-4 pr-7 py-1 outline-none focus:border-blue-500"
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
              >
                <option value="CHS">简体中文</option>
                <option value="CHT">繁體中文</option>
                <option value="JPN">日本語</option>
                <option value="ENG">English</option>
                <option value="KOR">한국어</option>
                <option value="VIN">Tiếng Việt</option>
                <option value="CSY">čeština</option>
                <option value="NLD">Nederlands</option>
                <option value="FRA">français</option>
                <option value="DEU">Deutsch</option>
                <option value="HUN">magyar nyelv</option>
                <option value="ITA">italiano</option>
                <option value="PLK">polski</option>
                <option value="PTB">português</option>
                <option value="ROM">limba română</option>
                <option value="RUS">русский язык</option>
                <option value="ESP">español</option>
                <option value="TRK">Türk dili</option>
                <option value="IND">Indonesia</option>
              </select>
              <i
                className="iconify absolute top-1 right-1 text-gray-500 pointer-events-none"
                data-icon="carbon:chevron-down"
              ></i>
            </div>
          </div>
        </div>

        {/* オプション（2段目） */}
        <div className="flex flex-wrap items-end gap-4">
          {/* Inpainting Size */}
          <div className="flex items-center gap-1" title="Inpainting Size">
            <i
              className="iconify text-gray-600"
              data-icon="carbon:paint-brush"
            ></i>
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
              <i
                className="iconify absolute top-1 right-1 text-gray-500 pointer-events-none"
                data-icon="carbon:chevron-down"
              ></i>
            </div>
          </div>

          {/* Unclip Ratio */}
          <div className="flex items-center gap-1" title="Unclip Ratio">
            <i
              className="iconify text-gray-600"
              data-icon="weui:max-window-filled"
            ></i>
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
            <i
              className="iconify text-gray-600"
              data-icon="weui:photo-wall-outlined"
            ></i>
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
            <i
              className="iconify text-gray-600"
              data-icon="material-symbols:adjust-outline"
            ></i>
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
            <i
              className="iconify text-gray-600"
              data-icon="carbon:paint-brush"
            ></i>
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
              <i
                className="iconify absolute top-1 right-1 text-gray-500 pointer-events-none"
                data-icon="carbon:chevron-down"
              ></i>
            </div>
          </div>
        </div>

        {/* メインコンテンツエリア */}
        <div>
          {/* 結果表示 */}
          {result ? (
            <div className="flex flex-col items-center space-y-4">
              <img
                className="max-w-full max-h-[50vh] rounded-md"
                src={resultUri}
                alt="Result"
              />
              <button
                type="button"
                onClick={clearForm}
                className="px-3 py-2 text-center rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Upload another
              </button>
            </div>
          ) : status ? (
            /* 処理中ステータス表示 */
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-8 h-72">
              {error ? (
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="text-red-600 font-semibold">{statusText}</div>
                  <button
                    type="button"
                    onClick={clearForm}
                    className="px-3 py-2 text-center rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Upload another
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-center text-gray-700">
                  <i
                    className="iconify w-8 h-8 text-gray-500 animate-spin"
                    data-icon="carbon:progress-bar-round"
                  ></i>
                  <div>{statusText}</div>
                </div>
              )}
            </div>
          ) : (
            /* 画像未アップロード時のアップロードボックス */
            <label
              htmlFor="file"
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-8 h-72 cursor-pointer hover:border-blue-400 transition-colors"
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={(e) => e.preventDefault()}
              onDragLeave={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              {file ? (
                /* 選択済みファイルがある場合 */
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="text-gray-700">
                    <span
                      className="iconify-inline inline-block mr-2 text-xl"
                      data-icon="carbon:image-search"
                    ></span>
                    File Preview
                  </div>
                  <img
                    className="max-w-[18rem] max-h-[18rem] rounded-md border border-gray-200"
                    src={fileUri ?? ""}
                    alt="Preview"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Translate
                  </button>
                  <div className="text-sm text-gray-500">
                    Click the empty space or paste/drag a new one to replace
                  </div>
                </div>
              ) : (
                /* まだファイルがない場合 */
                <div className="flex flex-col items-center gap-2 text-center">
                  <i
                    className="iconify w-8 h-8 text-gray-500"
                    data-icon="carbon:cloud-upload"
                  ></i>
                  <div className="text-gray-600">
                    Paste an image, click to select one, or drag and drop here
                  </div>
                </div>
              )}
              <input
                id="file"
                type="file"
                accept="image/png,image/jpeg,image/bmp,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          )}
        </div>
      </form>
    </div>
  );
};

export default App;
