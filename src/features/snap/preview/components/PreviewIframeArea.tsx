// プレビュー表示領域（iframeで分離表示）コンポーネント
import React, { useCallback, useEffect, useRef } from "react";

interface PreviewIframeAreaProps {
  iframeHtml: string;
  width: number;
  height?: number;
}

const PreviewIframeArea: React.FC<PreviewIframeAreaProps> = ({
  iframeHtml,
  width,
  height = 400,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // iframe内にハイライト用スクリプトを注入
  const injectHighlightScript = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const win = iframe.contentWindow;
    if (!win) return;
    try {
      // 既にスクリプトが入っていればスキップ
      // 型安全にwindowへプロパティを付与
      if (
        "__highlightInjected" in win &&
        (win as Window & { __highlightInjected?: boolean }).__highlightInjected
      )
        return;
      const script = win.document.createElement("script");
      script.type = "text/javascript";
      script.text = `
        let lastHovered;
        let lastSelected;
        function clearHighlight() {
          if (lastHovered) lastHovered.style.outline = '';
        }
        function clearSelected() {
          if (lastSelected) lastSelected.style.boxShadow = '';
        }
        document.body.addEventListener('mouseover', e => {
          clearHighlight();
          let el = e.target;
          if (el && el !== document.body && el !== document.documentElement) {
            el.style.outline = '2px solid #38bdf8';
            lastHovered = el;
          }
        }, true);
        document.body.addEventListener('mouseout', e => {
          clearHighlight();
        }, true);
        document.body.addEventListener('click', e => {
          clearSelected();
          let el = e.target;
          if (el && el !== document.body && el !== document.documentElement) {
            el.style.boxShadow = '0 0 0 3px #f59e42';
            lastSelected = el;
            // 選択情報を親にpostMessage
            // rect情報もpostMessageで送信
            const rect = el.getBoundingClientRect();
            // computed styleをインラインstyle属性として付与
            function getComputedStyleString(element) {
              const computed = window.getComputedStyle(element);
              // レイアウトに影響する主要プロパティのみ抽出
              const keys = [
                'display','flexDirection','flexWrap','justifyContent','alignItems','alignContent','gap','rowGap','columnGap',
                'gridTemplateColumns','gridTemplateRows','gridColumnGap','gridRowGap','gridAutoFlow',
                'width','minWidth','maxWidth','height','minHeight','maxHeight',
                'boxSizing','margin','marginTop','marginBottom','marginLeft','marginRight',
                'padding','paddingTop','paddingBottom','paddingLeft','paddingRight',
                'border','borderTop','borderBottom','borderLeft','borderRight',
                'position','top','left','right','bottom','float','clear','overflow','overflowX','overflowY',
                'background','backgroundColor','backgroundImage','backgroundSize','backgroundRepeat','backgroundPosition',
                'font','fontSize','fontWeight','fontFamily','color','lineHeight','letterSpacing','textAlign','verticalAlign',
                'whiteSpace','wordBreak','wordWrap','textOverflow','zIndex','opacity','visibility','pointerEvents','cursor'
              ];
              return keys.map(k => \`\${k.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}:\${computed[k]};\`).join('');
            }
            // outerHTMLをパースしてstyle属性を上書き
            function injectStyleToOuterHTML(html, styleStr) {
              return html.replace(/^(<[^>]+)(>)/, (m, tagStart, tagEnd) => {
                if (/style=/.test(tagStart)) {
                  return tagStart.replace(/style=("|')([^"']*)("|')/, (sm, q1, sbody, q2) => {
                    return \`style=\${q1}\${styleStr}\${sbody}\${q2}\`;
                  }) + tagEnd;
                } else {
                  return tagStart + \` style="\${styleStr}"\` + tagEnd;
                }
              });
            }
            const styleStr = getComputedStyleString(el);
            const styledOuterHTML = injectStyleToOuterHTML(el.outerHTML, styleStr);
            window.parent.postMessage({
              type: 'region-select',
              tag: el.tagName,
              id: el.id,
              class: el.className,
              outerHTML: styledOuterHTML,
              rect: { width: rect.width, height: rect.height }
            }, '*');
          }
        }, true);
        (window).__highlightInjected = true;
      `;
      win.document.body.appendChild(script);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      injectHighlightScript();
    }, 200); // iframe描画後に注入
    return () => clearTimeout(timer);
  }, [iframeHtml, injectHighlightScript]);

  // 選択情報の受信例（今後親コンポーネントで利用可能）
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "region-select") {
        // console.log('選択要素:', e.data);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return (
    <div
      className="flex-1 min-w-0 min-h-0 p-6 bg-white flex items-stretch justify-stretch"
      style={{
        width: width + "px",
        height: height + "px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <iframe
        ref={iframeRef}
        title="HTMLプレビュー"
        sandbox="allow-scripts allow-same-origin"
        srcDoc={iframeHtml}
        style={{
          width: "100%",
          height: "100%",
          minHeight: "0",
          minWidth: "0",
          border: "none",
          display: "block",
          boxSizing: "border-box",
          background: "white",
          maxWidth: "100%",
          maxHeight: "100%",
          position: "absolute",
          left: 0,
          top: 0,
        }}
      />
    </div>
  );
};

export default PreviewIframeArea;
