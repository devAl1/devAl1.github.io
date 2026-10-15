# Family Hub connection handoff

Public, static approval handoff only. Hosted at https://deval1.github.io/family-hub-connect/.
No sign-in UI, account credentials, family data, API keys or secrets belong here.
Authorization is reviewed inside the installed iOS app. The page uses only public
OAuth endpoints; its polling secret stays in memory and its QR contains only a
short-lived app approval code. OAuth discovery is in `.well-known/oauth-authorization-server/family-hub-oauth.json`;
the issuer is `/family-hub-oauth.json` so the discovery response has a JSON media type.

`family-hub-connect/qrcode.js` is the unmodified MIT-licensed qrcode-generator
2.0.4 distribution by Kazuhiko Arase, downloaded from its npm package.

Publish only this directory to the separate public `devAl1/devAl1.github.io`
repository. Never copy application source or configuration into that repository.
