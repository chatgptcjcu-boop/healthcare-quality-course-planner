import json,pathlib
r=pathlib.Path(__file__).parent
schema=json.loads((r/'schema.json').read_text())
url=json.loads((r/'config.json').read_text())['webAppUrl']
html=(r/'template.html').read_text().replace('__SCHEMA__',json.dumps(schema,ensure_ascii=False)).replace('__URL__',json.dumps(url)).replace('__EXAMPLES__',(r/'examples.json').read_text()).replace('__CASE__',(r/'cases/longcare-quality-newcomer.json').read_text()).replace('__VALIDATION__',(r/'validation.js').read_text()).replace('__APP__',(r/'app.js').read_text())
(r/'index.html').write_text(html)
(r/'apps-script/Index.html').write_text(html)
backend=(r/'server.js').read_text().replace('__SCHEMA__',json.dumps(schema,ensure_ascii=False)).replace('__VALIDATION__',(r/'validation.js').read_text())
(r/'apps-script/Code.gs').write_text(backend)
# Single-file install: includes the exact HTML and needs no external-fetch scope.
standalone=backend.replace("HtmlService.createHtmlOutputFromFile('Index')",'HtmlService.createHtmlOutput('+json.dumps(html,ensure_ascii=False)+')')
(r/'apps-script/Install.gs.txt').write_text(standalone)
if (r/'deployment.local.json').exists():
    target=json.loads((r/'deployment.local.json').read_text())['sheetId']
    private=standalone.replace("const EXISTING_SHEET_ID='';","const EXISTING_SHEET_ID="+json.dumps(target)+";")
    (r/'outputs/Install-private.gs.txt').write_text(private)
