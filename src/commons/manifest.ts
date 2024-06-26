export const manifest = {
  ta_url: 'http://timestamp.digicert.com',
  claim_generator: 'ContentSure',
  title: 'title: Image Published',
  assertions: [
    {
      label: 'c2pa.actions',
      data: {
        actions: [
          {
            action: 'c2pa.published',
          },
        ],
      },
    },
    {
      label: 'stds.schema-org.CreativeWork',
      data: {
        '@context': 'http://schema.org/',
        '@type': 'CreativeWork',
        author: [
          {
            '@type': 'Person',
            name: 'Krishna Waske',
          },
          {
            '@type': 'Person',
            '@id': 'https://twitter.com/waskekrishna',
            name: 'waskekrishna',
          },
        ],
      },
      kind: 'Json',
    },
  ],
  ingredients: [],
};
