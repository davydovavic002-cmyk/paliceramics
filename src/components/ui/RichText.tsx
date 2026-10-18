import { Fragment, type ReactNode } from "react";

/**
 * Light formatting for texts edited in the admin:
 *   **bold**   *italic*   __underline__   "- " at line start = bullet
 * A single Enter is a line break. Everything else is shown as plain text (no HTML is ever injected).
 */

const INLINE = /\*\*(.+?)\*\*|__(.+?)__|\*([^*\s](?:[^*]*[^*\s])?)\*/;

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = [];
  let rest = text;
  let index = 0;

  while (rest.length > 0) {
    const match = INLINE.exec(rest);
    if (!match) {
      out.push(rest);
      break;
    }
    if (match.index > 0) out.push(rest.slice(0, match.index));

    const key = `${keyPrefix}-${index++}`;
    if (match[1] !== undefined) {
      out.push(
        <strong key={key} className="font-semibold">
          {renderInline(match[1], key)}
        </strong>
      );
    } else if (match[2] !== undefined) {
      out.push(
        <u key={key} className="underline underline-offset-2">
          {renderInline(match[2], key)}
        </u>
      );
    } else {
      out.push(<em key={key}>{renderInline(match[3] ?? "", key)}</em>);
    }
    rest = rest.slice(match.index + match[0].length);
  }

  return out;
}

const BULLET = /^\s*[-•]\s+(.*)$/;

export function RichText({ text }: { text: string }) {
  const lines = text.replace(/\r\n?/g, "\n").split("\n");

  return (
    <>
      {lines.map((line, i) => {
        const bullet = BULLET.exec(line);
        const next = lines[i + 1];
        const nextIsBullet = next !== undefined && BULLET.test(next);

        if (bullet) {
          return (
            <span key={i} className="block pl-[1.1em] -indent-[1.1em]">
              <span aria-hidden>•&nbsp;&nbsp;</span>
              {renderInline(bullet[1], `l${i}`)}
            </span>
          );
        }

        return (
          <Fragment key={i}>
            {renderInline(line, `l${i}`)}
            {next !== undefined && !nextIsBullet ? <br /> : null}
          </Fragment>
        );
      })}
    </>
  );
}
