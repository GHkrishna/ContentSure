// eslint-disable-next-line @typescript-eslint/no-unused-vars
const sample_payload = {
  authorName: 'Alice',
  authorSocial: 'https://twitter.com',
  authorEmail: 'abc@abc.com',
  title: 'TitleCustom',
  file: '',
};

export const abc = `curl -X 'POST' \
'https://devapi.credebl.id/orgs/1212-12121-1212-121221/credentials/oob/email?credentialType=indy' \
-H 'accept: application/json' \
-H 'Authorization: Bearer ' \
-H 'Content-Type: application/json' \
-d '{
  "credentialOffer": [
      {
          "emailId": "",
          "attributes": [
              {
                  "name": "Title of article",
                  "value": ""
              },
              {
                  "name": "Name",
                  "value": ""
              },
              {
                  "name": "Certificate Id",
                  "value": ""
              }
          ]
      }
  ],
  "credentialDefinitionId": "C3sJbG6AJqcFmPvyTE7ddg:3:CL:60104:daily news",
  "comment": "First credential from Snippet News",
  "protocolVersion": "v1",
  "credentialType": "indy"
}'`;
