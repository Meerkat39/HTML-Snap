/**
 * useInjectHighlightScript: iframeへのハイライト用スクリプト注入ロジックを提供するカスタムフック
 *
 * @param iframeRef 対象iframeのref
 * @param iframeHtml srcDocとして渡すHTML
 */
import { useCallback, useEffect } from "react";

export const useInjectHighlightScript = (
  iframeRef: React.RefObject<HTMLIFrameElement | null>,
  iframeHtml: string
) => {
  const injectHighlightScript = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const win = iframe.contentWindow;
    if (!win) return;
    try {
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
  }, [iframeRef]);

  useEffect(() => {
    const timer = setTimeout(() => {
      injectHighlightScript();
    }, 200);
    return () => clearTimeout(timer);
  }, [iframeHtml, injectHighlightScript]);
};
