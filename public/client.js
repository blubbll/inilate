//fix da pres

const beauty = str => {
  return window.html_beautify(str.replace(/></gm, ">\r\n<").trim(), {
    indent_size: 2,
    end_with_newline: 1
  });
};

//fix to bingo
if (location.href.startsWith("https://translate.google")) {
  const bingUrl = $("meta[name=translate]").prop("content");
  /*prompt(
    "Sorry, we don't support gTranslate. Please copy and paste the following url into your navigation bar to go to Bing translate or click ok to continue: ",
    bingUrl
  );
  */
  location.href = bingUrl;
}

fetch("https://antilate.glitch.me/")
  .then(r => r.text())
  .then(t => {
    const original = $($.parseHTML(t));

    console.log(location.href)
  
    if (location.href.startsWith("https://translate.google")
       || location.href.startsWith("https://www.translatoruser-int.com")
       ) {
      $(original.find("section")).each((i, el) => {
        const curId = $(el).prop("id");

        if (curId) {
          const pre = $(el).find("[pre]");
          const pos = $(el).find("[pos]");

          const origHtml = $(el)
            .find("pre[pre]")
            .html();
          const brokenHtml = $(`#${curId}`)
            .find("pre[pos]")
            .html();

          const brokenHtmlmod = beauty(brokenHtml ? brokenHtml : origHtml);
          const origHtmlmod = beauty(beauty(origHtml));

          //fix pre code
          $(`#${curId}`)
            .find("pre[pre]")
            .text(origHtmlmod);
          //show pos code
          $(`#${curId}`)
            .find("pre[pos]")
            .text(brokenHtmlmod);
        }
      });
    } else {
      $("pre[pre]").each((i, el) => {
        $(el).text(beauty($(el).html()));
      });

      $("pre[pos]").text("not translating 🙉");
    }
  });
