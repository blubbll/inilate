//fix da pres

//q
{
  $.params = {};
  $.updateQuery = () => {
    var match,
      pl = /\+/g, // Regex for replacing addition symbol with a space
      search = /([^&=]+)=?([^&]*)/g,
      decode = s => {
        return decodeURIComponent(s.replace(pl, " "));
      },
      query = window.location.search.substring(1);
    while ((match = search.exec(query)))
      $.params[decode(match[1])] = decode(match[2]);
  };
  window.onpopstate = $.updateQuery;
  $.updateQuery();
}

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
  // location.href = bingUrl;
}

fetch("./?mode=notranslate")
  .then(r => r.text())
  .then(t => {
    const original = $($.parseHTML(t));

    //console.log(location.href);

    //set id
    $("section").each((i, el) => {
      $(el).attr("id", i);
    });

    const loc = $.params.u || location.href;
    if (loc.includes("scrollto=")) {
      const id = loc.split("scrollto=")[1];
      var elmnt = document.getElementById(id).parentElement;
      elmnt.scrollIntoView();
    }

    if (
      location.href.startsWith("https://translate.google") ||
      location.href.startsWith("https://www.translatoruser-int.com")
    ) {
      $(original)
        .find(".container>section")
        .each((i, el) => {
          if (
            $(el)
              .parent()
              .parent()[0].tagName === "HEADER"
          )
            return;
          const id = i;

          //get translated element by id
          const _tra = `#${i}`;
          const origHtml = $(el)
            .find("pre[pre]")
            .html();
          const traslaHtml = $(_tra)
            .find("pre[pre]")
            .html();

          const origMod = beauty(beauty(origHtml));
          const traslaMod = beauty(traslaHtml ? traslaHtml : origHtml);

          //fix pre code
          $(_tra)
            .find("pre[pre]")
            .text(origMod);

          //show pos code
          $(_tra)
            .find("pre[pos]")
            .text(traslaMod);

          //apply styles
          window.w3CodeColor($(_tra).find("pre[pre]")[0], "html");
          window.w3CodeColor($(_tra).find("pre[pos]")[0], "html");

          let outDiff = htmldiff(
            $(_tra)
              .find("pre[pre]")
              .html(),
            $(_tra)
              .find("pre[pos]")
              .html()
          );
          $(_tra)
            .find("pre[pos]")
            .html(outDiff);
        });
    } else {
      $("pre[pre]").each((i, el) => {
        $(el).text(beauty($(el).html()));
      });

      $("pre[pos]").text("not translating 🙉");
    }
  });

console.log($.params.u);

$("pre[comment]").each((i, el) => {
  const h = $(el)
    .find("h3")
    .text()
    .trim();
  $(el)
    .find("h3")
    .remove();
  $(el).html(
    `<h3>${h}</h3>` +
      "<p>" +
      $(el)
        .text()
        .trim() +
      "</p>"
  );
});
