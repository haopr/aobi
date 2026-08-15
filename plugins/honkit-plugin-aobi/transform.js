const TOPTHINK_HOST = /https?:\/\/9421dwl2gb\.k\.topthink\.com\/@aobi\//g;

function extractBvid(url) {
  const match = String(url).match(/BV[0-9A-Za-z]+/);
  return match ? match[0] : "";
}

function convertBilibili(markdown) {
  return markdown.replace(
    /```\[bilibili\]\s*\n\s*(https?:\/\/[^\s]+)\s*\n```/g,
    (_, url) => {
      const bvid = extractBvid(url);
      if (!bvid) {
        return `<p><a href="${url}" target="_blank" rel="noopener">${url}</a></p>`;
      }
      return [
        '<div class="tt-bilibili">',
        `<iframe src="https://player.bilibili.com/player.html?bvid=${bvid}&page=1&high_quality=1"`,
        ' scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>',
        "</div>",
      ].join(" ");
    }
  );
}

function convertLinkCards(markdown) {
  return markdown.replace(
    /::link\[([^\]]+)\]\{url="([^"]+)"\}/g,
    (_, title, url) =>
      `<p><a class="tt-link-card" href="${url}" target="_blank" rel="noopener noreferrer">${title}</a></p>`
  );
}

function convertImageSizes(markdown) {
  return markdown.replace(
    /!\[([^\]]*)\]\(\s*(<[^>]+>|[^)\s]+)\s+=\s*([0-9.]+%?)(?:x[0-9.]+%?)?\s*\)/g,
    '![$1]($2 "w=$3")'
  );
}

function isolateAlerts(markdown) {
  const lines = markdown.split("\n");
  const output = [];

  for (let i = 0; i < lines.length; i += 1) {
    if (!/^>\s*\[(danger|info|warning|success|tip)\]/.test(lines[i])) {
      output.push(lines[i]);
      continue;
    }

    output.push(lines[i]);
    i += 1;
    while (i < lines.length && /^>/.test(lines[i])) {
      output.push(lines[i]);
      i += 1;
    }
    i -= 1;
    output.push("", "<!-- tt-alert-end -->", "");
  }

  return output.join("\n");
}

function before(markdown) {
  let result = String(markdown || "");
  result = result.replace(TOPTHINK_HOST, "");
  result = convertBilibili(result);
  result = convertLinkCards(result);
  result = convertImageSizes(result);
  result = isolateAlerts(result);
  return result;
}

function after(html) {
  let result = String(html || "");

  result = result.replace(
    /<p>(?:\s*\^(?:<br\s*\/?>)?\s*)+<\/p>/g,
    '<p class="tt-spacer"></p>'
  );
  result = result.replace(/<p>:-:\s*([\s\S]*?)<\/p>/g, '<p class="tt-center">$1</p>');
  result = result.replace(/<p>--:\s*([\s\S]*?)<\/p>/g, '<p class="tt-right">$1</p>');

  result = result.replace(/<blockquote>([\s\S]*?)<\/blockquote>/g, (match, inner) => {
    const typeMatch = inner.match(/\[(danger|info|warning|success|tip)\]/);
    if (!typeMatch) {
      return match;
    }
    const centered = /:-:/.test(inner);
    const cleaned = inner
      .replace(/\[(danger|info|warning|success|tip)\]\s*/g, "")
      .replace(/:-:\s*/g, "")
      .replace(/<p>\s*\^\s*<\/p>/g, "");
    const className = `tt-alert tt-${typeMatch[1]}${centered ? " tt-center" : ""}`;
    return `<div class="${className}">${cleaned}</div>`;
  });

  result = result.replace(
    /<img([^>]*?)title="w=([^"]+)"([^>]*)>/g,
    (_, beforeAttrs, width, afterAttrs) => {
      const percent = String(width).includes("%");
      const style = percent ? ` style="width:${width};height:auto"` : "";
      const widthAttr = percent ? "" : ` width="${width}"`;
      return `<img${beforeAttrs}${afterAttrs}${widthAttr}${style}>`;
    }
  );

  result = result.replace(/<\/img>/g, "");
  result = result.replace(/<!-- tt-alert-end -->/g, "");
  return result;
}

module.exports = { before, after, extractBvid };
