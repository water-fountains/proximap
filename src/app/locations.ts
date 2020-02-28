/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */



// GOOGLE API KEY
const googleApiKey = 'mykey';

export const locations = {
  'ch-zh': {
    name: 'Zurich',
    description: {
      en: ``,
      de: ``,
      fr: ``,
      it: ``,
      tr: ``,
    },
    description_more: {
      en: ``,
      de: ``,
      fr: ``,
      it: ``,
      tr: ``,
    },
    bounding_box: {
      'latMin': 47.3229261255644,
      'lngMin': 8.45960259979614,
      'latMax': 47.431119712250506,
      'lngMax': 8.61940272745742
    },
    'operator_fountain_catalog_qid': 'Q53629101',
    issue_api: {
      operator: 'Wasserversorgung Zürich',
      qid: null,
      thumbnail_url: 'https://upload.wikimedia.org/wikipedia/commons/4/41/ZueriWieNeuLogo.png',
      url_template: 'https://www.zueriwieneu.ch/report/new?longitude=${lon}&latitude=${lat}&category=Brunnen/Hydranten'
    }
  },
  'ch-ge': {
    name: 'Geneva',
    description: {
      en: ``,
      de: ``,
      fr: ``,
      it: ``,
      tr: ``,
    },
    description_more: {
      en: ``,
      de: ``,
      fr: ``,
      it: ``,
      tr: ``,
    },
    bounding_box: {
      'latMin': 46.113705723112744,
      'lngMin': 6.0129547119140625,
      'latMax': 46.29001987172955,
      'lngMax': 6.273880004882812
    },
    'operator_fountain_catalog_qid': 'undefined',
    issue_api: {
      operator: null,
      qid: null,
      thumbnail_url: ``,
      url_template: null
    }
  },
  'ch-bs': {
    name: 'Basel',
    description: {
      en: ``,
      de: ``,
      fr: ``,
      it: ``,
      tr: ``,
    },
    description_more: {
      en: ``,
      de: ``,
      fr: ``,
      it: ``,
      tr: ``,
    },
    bounding_box: {
      'latMin': 47.517200697839414,
      'lngMin': 7.544174194335937,
      'latMax': 47.60477416894759,
      'lngMax': 7.676696777343749
    },
    'operator_fountain_catalog_qid': 'undefined',
    issue_api: {
      operator: null,
      qid: null,
      thumbnail_url: ``,
      url_template: null
    }
  },
'ch-lu': {
  name: 'Lucerne',
  description: {
    en: ``,
    de: ``,
    fr: ``,
    it: ``,
    tr: ``,
  },
  description_more: {
    en: ``,
    de: ``,
    fr: ``,
    it: ``,
    tr: ``,
  },
  bounding_box: {
    'latMin': 47.03608752310776,
    'lngMin': 8.282318115234375,
    'latMax': 47.068718776878946,
    'lngMax': 8.33810806274414
  },
  'operator_fountain_catalog_qid': 'undefined',
  issue_api: {
    operator: null,
    qid: null,
    thumbnail_url: ``,
    url_template: null
  }
},
'ch-nw': {
  name: 'Nidwalden',
  description: {
    en: ``,
    de: ``,
    fr: ``,
    it: ``,
    tr: ``,
  },
  description_more: {
    en: ``,
    de: ``,
    fr: ``,
    it: ``,
    tr: ``,
  },
  bounding_box: {
    'latMin': 46.76432449601197,
    'lngMin': 8.20953369140625,
    'latMax': 47.01958886438217,
    'lngMax': 8.580322265624998
  },
  'operator_fountain_catalog_qid': 'undefined',
  issue_api: {
    operator: null,
    qid: null,
    thumbnail_url: ``,
    url_template: null
  }
},
'de-hh': {
  name: 'Hamburg',
  description: {
    en: ``,
    de: ``,
    fr: ``,
    it: ``,
    tr: ``,
  },
  description_more: {
    en: ``,
    de: ``,
    fr: ``,
    it: ``,
    tr: ``,
  },
  bounding_box: {
    'latMin': 53.4075,
    'lngMin': 9.657,
    'latMax': 53.7365,
    'lngMax': 10.2997
  },
  'operator_fountain_catalog_qid': 'undefined',
  issue_api: {
    operator: null,
    qid: null,
    thumbnail_url: ``,
    url_template: null
  }
},
'it-roma': {
name: 'Roma',
description: {
  en: ``,
  de: ``,
  fr: ``,
  it: ``,
  tr: ``,
},
description_more: {
  en: ``,
  de: ``,
  fr: ``,
  it: ``,
  tr: ``,
},
bounding_box: {
  'latMin': 41.793,
  'lngMin': 12.369,
  'latMax': 41.994,
  'lngMax': 12.622
},
  'operator_fountain_catalog_qid': 'undefined',
  issue_api: {
    operator: null,
    qid: null,
    thumbnail_url: ``,
    url_template: null
  }
},
'fr-paris': {
  name: 'Paris',
  description: {
    en: ``,
    de: ``,
    fr: ``,
    it: ``,
    tr: ``,
  },
  description_more: {
    en: ``,
    de: ``,
    fr: ``,
    it: ``,
    tr: ``,
  },
  bounding_box: {
    'latMin': 48.818,
    'lngMin': 2.246,
    'latMax': 48.901,
    'lngMax': 2.456
  },
  'operator_fountain_catalog_qid': 'undefined',
  issue_api: {
    operator: null,
    qid: null,
    thumbnail_url: ``,
    url_template: null
  }
},
'us-nyc': {
  name: 'New York',
  description: {
    en: ``,
    de: ``,
    fr: ``,
    it: ``,
    tr: ``,
  },
  description_more: {
    en: ``,
    de: ``,
    fr: ``,
    it: ``,
    tr: ``,
  },
  bounding_box: {
    'latMin': 40.643135583312805,
    'lngMin': -74.13848876953125,
    'latMax': 40.852254338121625,
    'lngMax': -73.81988525390624
  },
  'operator_fountain_catalog_qid': 'undefined',
  issue_api: {
    operator: null,
    qid: null,
    thumbnail_url: ``,
    url_template: null
  }
},
'tr-be': {
  name: 'Bergama',
  description: {
    en: `
      <h2>The water fountains of Bergama</h2>
      The 2019 topic of the Bergama Environmental Film Festival
      <a href='https://bergamacevreff.org/en' target='_blank'>https://bergamacevreff.org/en</a>
      is WATER, an indispensable component of our life and the planet. .
      Therefore responsible citizens have mapped out all fountains of the festival hosting city
      (with drinkable water or unfortunately no longer...) to foster environmental discussions to rebuild our future...
    `,
    de: ``,
    fr: ``,
    it: ``,
    tr: `
      <h2> Bergama'nın su çeşmeleri </h2>
      İklim krizinin olumsuzluklarının nedenlerini ortadan kaldırmak ve etkilerini azaltmak,
      bu olumsuzlukları yaratan bizler, insanların elinde. Bu nedenle sorumlu vatandaşlar olarak,
      iklim değişikliğine neden olan siyasal, toplumsal ve ekolojik sorunlar üzerine herkesi düşünmeye,
      sorgulamaya ve davranış değişikliğine yönlendiren bir film festivali yapıyoruz.
      Festivalin bu yılki teması bedenlerimizin ve gezegenin vazgeçilmez bileşeni SU.
      Büyük bir tehditle karşı karşıya olan ortak varlığımız su, bizi ulusların, dinlerin,
      nesillerin ve türlerin ötesinde birleştirecek güçte. İşte böyle berrak bir güçle geleceği yeniden inşa edebiliriz.
      Su gibi akan filmler, söyleşiler ve etkinliklerde buluşacağımız Bergama Çevre Filmleri
      Festivali’ne hepinizi yalnızca izlemek için değil, konuşmak, paylaşmak ve birlikte çözüm üretmek için de bekliyoruz.
      <a href='https://bergamacevreff.org' target='_blank'>https://bergamacevreff.org</a>
    `,
  },
  description_more: {
    en: `
      It is in our hands to eliminate and reduce the effects of all the disastrous events caused by Climate Crises.
      Therefore, as responsible citizens, we organized a film festival on environmental issues we expected to experience
      in Turkey to discuss solutions and encourage behavioral changes toward the social and ecological problems due to climate crises.
      To be effective in our discussions, we will address a different environmental theme each year.
      This year's theme is WATER, an indispensable component of our life and the planet.
      Our common existence, facing a major threat, has the power to unite us beyond nationalities,
      religions, generations and species. With such clear power, we can rebuild the future.
      We are inviting you not only to watch and talk, but more importantly to share and find
      solutions together in Bergama Environmental Films Festival, where we will meet in films,
      panel discussions and various side events flowing like water.
      <a href="https://bergamacevreff.org/en" target="_blank"> https://bergamacevreff.org/en</a>
      <a href="http://whc.unesco.org/en/list/1457" target="_blank"> http://whc.unesco.org/en/list/1457</a>

      <h3>Team</h3>
      <a href="https://commons.wikimedia.org/wiki/User:Fatih_Kurunaz" target="_blank">
      https://commons.wikimedia.org/wiki/User:Fatih_Kurunaz</a>
    `,
    de: ``,
    fr: ``,
    it: ``,
    tr: ``,
  },
  bounding_box: {
    'latMin': 39.08743603215884,
    'lngMin': 27.13726043701172,
    'latMax': 39.14097854651647,
    'lngMax': 27.21691131591797
  },
  'operator_fountain_catalog_qid': 'undefined',
  issue_api: {
    operator: null,
    qid: null,
    thumbnail_url: ``,
    url_template: null
  }
},
'test': {
    name: 'Test-City (not in Prod)',
    description: {
      en: ``,
      de: ``,
      fr: ``,
      it: ``,
      tr: ``,
    },
    description_more: {
      en: ``,
      de: ``,
      fr: ``,
      it: ``,
      tr: ``,
    },
    bounding_box: {
      // Schule Friesenberg with multiple Categories
      // 'latMin': 47.3602,
      // 'lngMin': 8.5054,
      // 'latMax': 47.3604,
      // 'lngMax': 8.5055
      // 2x Schule Friesenberg with multiple Categories
        'latMin': 47.3584,
        'lngMin': 8.5054,
        'latMax': 47.3604,
        'lngMax': 8.5058
      // Schule Friesenberg with 1 Category, no P18: 47.358684, 8.505754
      // 'latMin': 47.3584,
      // 'lngMin': 8.5054,
      // 'latMax': 47.3587,
      // 'lngMax': 8.5058
      // 5 fountains of Bergama
      //  'latMin': 39.117,
      // 'lngMin': 27.17,
      // 'latMax': 39.12,
      // 'lngMax': 27.19
    },
    'operator_fountain_catalog_qid': 'undefined',
    issue_api: {
      operator: null,
      qid: null,
      thumbnail_url: ``,
      url_template: null
    }
  },
gak: googleApiKey
};
