/*
 * @license
 * (c) Copyright 2019 | MY-D Foundation | Created by Matthew Moy de Vitry
 * Use of this code is governed by the GNU Affero General Public License (https://www.gnu.org/licenses/agpl-3.0)
 * and the profit contribution agreement available at https://www.my-d.org/ProfitContributionAgreement
 */

import {PROP_STATUS_OK, PROP_STATUS_WARNING} from './constants';
import {locations} from './locations';

// const _ = require('lodash');
import _ from 'lodash';

/**
 * function that passes data through without modification
 * @param {any} val - any object, string or number
 */
function identity(val) { return val; }

export const fountain_properties = {
  name: {  // unique codename of property
    name: {  // name of property in all supported languages
      en: 'title',
      de: 'Titel',
      fr: 'titre',
      it: 'titolo',
      tr: 'başlık'
    },
    essential: true,  // whether this property should be included in short version of data
    type: 'string',  // type of data, such as string, number, boolean_string, etc. Used for displaying property
    descriptions: {  // description of what property represents
      en: 'Original title of the fountain, for example the title given by the sculptor.',
      de: 'Originaltitel des Brunnens, zum Beispiel der vom Bildhauer gegeben wurde.',
      fr: 'Titre original de la fontaine, par exemple celui donné par le sculpteur.',
      it: 'Titolo originale della fontana, per esempio il titolo dato dallo scultore',
      tr: 'Çeşmeyi yapan kişi tarafından verilmiş özgün isim.'
    },
    src_pref: ['osm', 'wikidata'],
    // which source should be given priority? only the first element in the list matters, since there are only two sources
    src_config: {
      wikidata: {
        // help: 'https://url.com',
        // url to page that describes the property.
        // This is only necessary for certain properties for which the help page cannot be derived from the 'src_path'
        src_path: ['claims', 'P1476'],
        // describes path for extracting this property from the response of the wikidata api (after simplification of the response)
        src_instructions: {
          // human-readable path of how to modify this propoerty on wikidata.org. For example: create a Statement of type "title"
          en: ['Statement', 'title'],
          de: ['Aussage', 'Titel'],
          fr: ['Déclaration', 'titre'],
          it: ['Dichiarazione', 'titolo'],
          tr: ['tanım', 'başlık']
        },
        value_translation: identity  // function for transforming the data from the source (see "construction_date" for an example).
      },
      osm: {
        src_path: ['properties', 'name'],
        src_instructions: {
          en: ['tag', 'name'],
          de: ['Attribut', 'name'],
          fr: ['Attribut', 'name'],
          it: ['Attributo', 'name'],
          tr: ['Özellik', 'name']
        },
        value_translation: identity
      }
    }
  },
  name_en: {
    name: {
      en: 'name (en)',
      de: 'Name (en)',
      fr: 'nom (en)',
      it: 'nome (en)',
      tr: 'isim (en)'
    },
    essential: true,
    type: 'string',
    descriptions: {
      en: 'Name of the fountain in English.',
      de: 'Name des Brunnens auf Englisch.',
      fr: 'Nom de la fontaine en anglais.',
      it: 'Nome della fontana in inglese.',
      tr: 'Çeşmenin İngilizce ismi.'
    },
    src_pref: ['osm', 'wikidata'],
    src_config: {
      wikidata: {
        help: 'https://www.wikidata.org/wiki/Help:Label',
        src_path: ['labels', 'en'],
        src_instructions: {
          en: ['Label', 'English'],
          de: ['Bezeichnung', 'Englisch'],
          fr: ['Libellé', 'anglais'],
          it: ['Denominazione', 'inglese'],
          tr: ['Etiket', 'İngilizce']
        },
        value_translation: identity
      },
      osm: {
        help: 'https://wiki.openstreetmap.org/wiki/Multilingual_names',
        src_path: ['properties', 'name:en'],
        src_instructions: {
          en: ['tag', 'name:en'],
          de: ['Attribut', 'name:en'],
          fr: ['Attribut', 'name:en'],
          it: ['Attributo', 'name:en'],
          tr: ['Özellik', 'name:en']
        },
        value_translation: identity
      }
    }
  },
  name_de: {
    name: {
      en: 'name (de)',
      de: 'Name (de)',
      fr: 'nom (de)',
      it: 'nome (de)',
      tr: 'isim (de)'
    },
    essential: true,
    type: 'string',
    descriptions: {
      en: 'Name of the fountain in German',
      de: 'Name des Brunnens auf Deutsch.',
      fr: 'Nom de la fontaine en allemand.',
      it: 'Nome della fontana in tedesco.',
      tr: 'Çeşmenin Almanca ismi.'
    },
    src_pref: ['osm', 'wikidata'],
    src_config: {
      wikidata: {
        help: 'https://www.wikidata.org/wiki/Help:Label',
        src_path: ['labels', 'de'],
        src_instructions: {
          en: ['Label', 'German'],
          de: ['Bezeichnung', 'Deutsch'],
          fr: ['Libellé', 'allemand'],
          it: ['Denominazione', 'tedesco'],
          tr: ['Etiket', 'Almanca']
        },
        value_translation: identity
      },
      osm: {
        help: 'https://wiki.openstreetmap.org/wiki/Multilingual_names',
        src_path: ['properties', 'name:de'],
        src_instructions: {
          en: ['tag', 'name:de'],
          de: ['Attribut', 'name:de'],
          fr: ['Attribut', 'name:de'],
          it: ['Attributo', 'name:de'],
          tr: ['Özellik', 'name:de']
        },
        value_translation: identity
      }
    }
  },
  name_fr: {
    name: {
      en: 'name (fr)',
      de: 'Name (fr)',
      fr: 'nom (fr)',
      it: 'nome (fr)',
      tr: 'isim (fr)'
    },
    essential: true,
    type: 'string',
    descriptions: {
      en: 'Name of the fountain in French',
      de: 'Name des Brunnens auf Französisch.',
      fr: 'Nom de la fontaine en français.',
      it: 'Nome della fontana in francese.',
      tr: 'Çeşmenin Fransızca ismi.'
    },
    src_pref: ['osm', 'wikidata'],
    src_config: {
      wikidata: {
        help: 'https://www.wikidata.org/wiki/Help:Label',
        src_path: ['labels', 'fr'],
        src_instructions: {
          en: ['Label', 'French'],
          de: ['Bezeichnung', 'Französisch'],
          fr: ['Libellé', 'français'],
          it: ['Denominazione', 'francese'],
          tr: ['Etiket', 'Fransızca']
        },
        value_translation: identity
      },
      osm: {
        help: 'https://wiki.openstreetmap.org/wiki/Multilingual_names',
        src_path: ['properties', 'name:fr'],
        src_instructions: {
          en: ['tag', 'name:fr'],
          de: ['Attribut', 'name:fr'],
          fr: ['Attribut', 'name:fr'],
          it: ['Attributo', 'name:fr'],
          tr: ['Özellik', 'name:fr']
        },
        value_translation: identity
      }
    }
  },
  name_it: {
    name: {
      en: 'name (it)',
      de: 'Name (it)',
      fr: 'nom (it)',
      it: 'nome (it)',
      tr: 'isim (it)'
    },
    essential: true,
    type: 'string',
    descriptions: {
      en: 'Name of the fountain in Italian',
      de: 'Name des Brunnens auf Italienisch.',
      fr: 'Nom de la fontaine en italien.',
      it: 'Nome della fontana in italiano.',
      tr: 'Çeşmenin İtalyanca ismi.'
    },
    src_pref: ['osm', 'wikidata'],
    src_config: {
      wikidata: {
        help: 'https://www.wikidata.org/wiki/Help:Label',
        src_path: ['labels', 'it'],
        src_instructions: {
          en: ['Label', 'Italian'],
          de: ['Bezeichnung', 'Italienisch'],
          fr: ['Libellé', 'italien'],
          it: ['Denominazione', 'italiano'],
          tr: ['Etiket', 'İtalyanca']
        },
        value_translation: identity
      },
      osm: {
        help: 'https://wiki.openstreetmap.org/wiki/Multilingual_names',
        src_path: ['properties', 'name:it'],
        src_instructions: {
          en: ['tag', 'name:it'],
          de: ['Attribut', 'name:it'],
          fr: ['Attribut', 'name:it'],
          it: ['Attributo', 'name:it'],
          tr: ['Özellik', 'name:it']
        },
        value_translation: identity
      }
    }
  },
  name_tr: {
    name: {
      en: 'name (tr)',
      de: 'Name (tr)',
      fr: 'nom (tr)',
      it: 'nome (tr)',
      tr: 'isim (tr)'
    },
    essential: true,
    type: 'string',
    descriptions: {
      en: 'Name of the fountain in Turkish',
      de: 'Name des Brunnens auf Türkisch.',
      fr: 'Nom de la fontaine en turc.',
      it: 'Nome della fontana in turco.',
      tr: 'Çeşmenin Türkçe ismi.'
    },
    src_pref: ['osm', 'wikidata'],
    src_config: {
      wikidata: {
        help: 'https://www.wikidata.org/wiki/Help:Label',
        src_path: ['labels', 'tr'],
        src_instructions: {
          en: ['Label', 'Turkish'],
          de: ['Bezeichnung', 'Türkisch'],
          fr: ['Libellé', 'turc'],
          it: ['Denominazione', 'turco'],
          tr: ['Etiket', 'Türkçe']
        },
        value_translation: identity
      },
      osm: {
        help: 'https://wiki.openstreetmap.org/wiki/Multilingual_names',
        src_path: ['properties', 'name:tr'],
        src_instructions: {
          en: ['tag', 'name:tr'],
          de: ['Attribut', 'name:tr'],
          fr: ['Attribut', 'name:tr'],
          it: ['Attributo', 'name:tr'],
          tr: ['Özellik', 'name:tr']
        },
        value_translation: identity
      }
    }
  },
  description_short_en: {
    name: {
      en: 'description (en)',
      de: 'Beschreibung (en)',
      fr: 'description (en)',
      it: 'descrizione (en)',
      tr: 'açıklama (en)'
    },
    essential: false,
    type: 'string',
    descriptions: {
      en: 'Short description of the fountain in English.',
      de: 'Kurze Beschreibung des Brunnens auf Englisch.',
      fr: 'Brève description de la fontaine en anglais.',
      it: 'Breve descrizione della fontana in inglese.',
      tr: 'Çeşmenin İnglizce kısa açıklaması.'
    },
    src_pref: ['osm', 'wikidata'],
    src_config: {
      osm: {
        help: 'https://wiki.openstreetmap.org/wiki/Key:description',
        src_path: ['properties', 'description:en'],
        src_instructions: {
          en: ['tag', 'description:en'],
          de: ['Attribut', 'description:en'],
          fr: ['Attribut', 'description:en'],
          it: ['Attributo', 'description:en'],
          tr: ['Özellik', 'description:en']
        },
        value_translation: identity
      },
      wikidata: {
        help: 'https://www.wikidata.org/wiki/Help:Description',
        src_path: ['descriptions', 'en'],
        src_instructions: {
          en: ['Description', 'English'],
          de: ['Beschreibung', 'Englisch'],
          fr: ['Description', 'anglais'],
          it: ['Descrizione', 'inglese'],
          tr: ['Açıklama', 'İngilizce']
        },
        value_translation: identity
      }
    }
  },
  description_short_de: {
    name: {
      en: 'description (de)',
      de: 'Beschreibung (de)',
      fr: 'description (de)',
      it: 'descrizione (de)',
      tr: 'açıklama (de)'
    },
    essential: false,
    type: 'string',
    descriptions: {
      en: 'Short description of the fountain in German.',
      de: 'Kurze Beschreibung des Brunnens auf Deutsch.',
      fr: 'Brève description de la fontaine en allemand.',
      it: 'Breve descrizione della fontana in tedesco.',
      tr: 'Çeşmenin Almanca kısa açıklaması.'
    },
    src_pref: ['osm', 'wikidata'],
    src_config: {
      osm: {
        help: 'https://wiki.openstreetmap.org/wiki/Key:description',
        src_path: ['properties', 'description:de'],
        src_instructions: {
          en: ['tag', 'description:de'],
          de: ['Attribut', 'description:de'],
          fr: ['Attribut', 'description:de'],
          it: ['Attributo', 'description:de'],
          tr: ['Özellik', 'description:de']
        },
        value_translation: identity
      },
      wikidata: {
        help: 'https://www.wikidata.org/wiki/Help:Description',
        src_path: ['descriptions', 'de'],
        src_instructions: {
          en: ['Description', 'German'],
          de: ['Beschreibung', 'Deutsch'],
          fr: ['Description', 'allemand'],
          it: ['Descrizione', 'tedesco'],
          tr: ['Açıklama', 'Almanca']
        },
        value_translation: identity
      }
    }
  },
  description_short_fr: {
    name: {
      en: 'description (fr)',
      de: 'Beschreibung (fr)',
      fr: 'description (fr)',
      it: 'descrizione (fr)',
      tr: 'açıklama (fr)'
    },
    essential: false,
    type: 'string',
    descriptions: {
      en: 'Short description of the fountain in French.',
      de: 'Kurze Beschreibung des Brunnens auf Französisch.',
      fr: 'Brève description de la fontaine en français.',
      it: 'Breve descrizione della fontana in francese.',
      tr: 'Çeşmenin Fransızca kısa açıklaması.'
    },
    src_pref: ['osm', 'wikidata'],
    src_config: {
      osm: {
        help: 'https://wiki.openstreetmap.org/wiki/Key:description',
        src_path: ['properties', 'description:fr'],
        src_instructions: {
          en: ['tag', 'description:fr'],
          de: ['Attribut', 'description:fr'],
          fr: ['Attribut', 'description:fr'],
          it: ['Attributo', 'description:fr'],
          tr: ['Özellik', 'description:fr']
        },
        value_translation: identity
      },
      wikidata: {
        help: 'https://www.wikidata.org/wiki/Help:Description',
        src_path: ['descriptions', 'fr'],
        src_instructions: {
          en: ['Description', 'French'],
          de: ['Beschreibung', 'Französisch'],
          fr: ['Description', 'français'],
          it: ['Descrizione', 'francese'],
          tr: ['Açıklama', 'Fransızca']
        },
        value_translation: identity
      }
    }
  },
  description_short_it: {
    name: {
      en: 'description (it)',
      de: 'Beschreibung (it)',
      fr: 'description (it)',
      it: 'descrizione (it)',
      tr: 'açıklama (it)'
    },
    essential: false,
    type: 'string',
    descriptions: {
      en: 'Short description of the fountain in Italian.',
      de: 'Kurze Beschreibung des Brunnens auf Italienisch.',
      fr: 'Brève description de la fontaine en italien.',
      it: 'Breve descrizione della fontana in italiano.',
      tr: 'Çeşmenin İtalyanca kısa açıklaması.'
    },
    src_pref: ['osm', 'wikidata'],
    src_config: {
      osm: {
        help: 'https://wiki.openstreetmap.org/wiki/Key:description',
        src_path: ['properties', 'description:it'],
        src_instructions: {
          en: ['tag', 'description:it'],
          de: ['Attribut', 'description:it'],
          fr: ['Attribut', 'description:it'],
          it: ['Attributo', 'description:it'],
          tr: ['Özellik', 'description:it']
        },
        value_translation: identity
      },
      wikidata: {
        help: 'https://www.wikidata.org/wiki/Help:Description',
        src_path: ['descriptions', 'it'],
        src_instructions: {
          en: ['Description', 'Italian'],
          de: ['Beschreibung', 'Italienisch'],
          fr: ['Description', 'italien'],
          it: ['Descrizione', 'italiano'],
          tr: ['Açıklama', 'İtalyanca']
        },
        value_translation: identity
      }
    }
  },
  description_short_tr: {
    name: {
      en: 'description (tr)',
      de: 'Beschreibung (tr)',
      fr: 'description (tr)',
      it: 'descrizione (tr)',
      tr: 'açıklama (tr)'
    },
    essential: false,
    type: 'string',
    descriptions: {
      en: 'Short description of the fountain in Turkish.',
      de: 'Kurze Beschreibung des Brunnens auf Türkisch.',
      fr: 'Brève description de la fontaine en turc.',
      it: 'Breve descrizione della fontana in turco.',
      tr: 'Çeşmenin Türkçe kısa açıklaması.'
    },
    src_pref: ['osm', 'wikidata'],
    src_config: {
      osm: {
        help: 'https://wiki.openstreetmap.org/wiki/Key:description',
        src_path: ['properties', 'description:tr'],
        src_instructions: {
          en: ['tag', 'description:tr'],
          de: ['Attribut', 'description:tr'],
          fr: ['Attribut', 'description:tr'],
          it: ['Attributo', 'description:tr'],
          tr: ['Özellik', 'description:tr']
        },
        value_translation: identity
      },
      wikidata: {
        help: 'https://www.wikidata.org/wiki/Help:Description',
        src_path: ['descriptions', 'tr'],
        src_instructions: {
          en: ['Description', 'Turkish'],
          de: ['Beschreibung', 'Türkisch'],
          fr: ['Description', 'turc'],
          it: ['Descrizione', 'turco'],
          tr: ['Açıklama', 'Türkçe ']
        },
        value_translation: identity
      }
    }
  },
  id_osm: {
    name: {
      en: 'ID (OpenStreetMap)',
      de: 'ID (OpenStreetMap)',
      fr: 'ID (OpenStreetMap)',
      it: 'ID (OpenStreetMap)',
      tr: 'ID (OpenStreetMap)'
    },
    essential: true,
    type: 'string',
    descriptions: {
      // tslint:disable-next-line:max-line-length
      en: 'Identifier used by OpenStreetMap for the fountain. Fountains can be either nodes or ways, therefore the identifier must start with either "node" or "way".',
      // tslint:disable-next-line:max-line-length
      de: 'Kennung, die von OpenStreetMap für den Brunnen verwendet wird. Brunnen können entweder Knoten oder Wege sein, daher muss der Identifikator entweder mit "node" oder "way" beginnen.',
      // tslint:disable-next-line:max-line-length
      fr: 'Identifiant utilisé par OpenStreetMap pour la fontaine. Les fontaines peuvent être soit des noeuds, soit des voies, donc l\'identificateur doit commencer par "node" ou "way".',
      // tslint:disable-next-line:max-line-length
      it: 'Identificatore utilizzato da OpenStreetMap per la fontana. Le fontane possono essere nodi o vie, quindi l\'identificatore deve iniziare per "node" o "way".',
      // tslint:disable-next-line:max-line-length
      tr: 'Tanımlayıcı, OpenStreetMap tarafından çeşmeler için kullanıldı. çeşmeler beze veya yol olabilir, bu yüzden tanımlayıcı "beze" veya "yol" olarak başlamalıdır. '
    },
    src_pref: ['osm'],
    src_config: {
      osm: {
        help: 'https://wiki.openstreetmap.org/wiki/Elements',
        src_path: ['properties', 'id'],
        src_instructions: {
          en: ['-'],
          de: ['-'],
          fr: ['-'],
          it: ['-'],
          tr: ['-']
        },
        src_info: {
          en: 'OpenStreetMap identifier cannot be easily modified in online editor',
          de: 'OpenStreetMap Identifikator kann nicht einfach im Online Editor geändert werden.',
          fr: 'L\'identifiant OpenStreetMap ne peut pas être facilement modifié dans l\'éditeur en ligne',
          it: 'L\'identificatore OpenStreetMap non può essere modificato facilmente nell\'editor online',
          tr: 'OpenStreetMap kimliği çevrimiçi düzenleyici tarafından kolaylıkla düzenlenemez. '
        },
        value_translation: identity
      },
      wikidata: null
    }
  },
  id_operator: {
    name: {
      en: 'ID (operator)',
      de: 'ID (Betreiber)',
      fr: 'ID (opérateur)',
      it: 'ID (operatore)',
      tr: 'ID (operatör)'
    },
    essential: true,
    type: 'string',
    descriptions: {
      en: 'Identifier used by the fountain operator to catalog the fountain.',
      de: 'Kennung, die vom Brunnenbetreiber zur Katalogisierung des Brunnens verwendet wird.',
      fr: 'Identificateur utilisé par l\'opérateur de la fontaine pour cataloguer la fontaine.',
      it: 'Identificatore usato dall\'operatore della fontana per catalogarla.',
      tr: 'Tanımlayıcı çeşme operatörü tarafından çeşmeyi kataloglamak için kullanılır. '
    },
    src_pref: ['wikidata', 'osm'],
    src_config: {
      wikidata: {
        src_path: ['claims', 'P528'],
        src_instructions: {
          en: ['Statement', 'catalog code'],
          de: ['Aussage', 'Katalognummer'],
          fr: ['Déclaration', 'numéro de catalogue'],
          it: ['Dichiarazione', 'codice del catalogo'],
          tr: ['Tanım', 'katalog kodu']
        },
        src_info: {
          // tslint:disable-next-line:max-line-length
          en:`The catalog code must have a 'catalog' qualifier referring to the catalog documented in the location metadata. (${_.map(locations, (l, name) => {return `${l.name}: ${l.operator_fountain_catalog_qid}`}).join(', ')})`,
          // tslint:disable-next-line:max-line-length
          de: `Der Katalogcode muss einen 'Katalog'-Qualifizierer haben, der sich auf den in den Standortmetadaten dokumentierten Katalog bezieht. (${_.map(locations, (l, name) => {return `${l.name}: ${l.operator_fountain_catalog_qid}`}).join(', ')})`,
          // tslint:disable-next-line:max-line-length
          fr: `Le code de catalogue doit avoir un qualificatif \'catalogue\' faisant référence au catalogue documenté dans les métadonnées de localisation. (${_.map(locations, (l, name) => {return `${l.name} : ${l.operator_fountain_catalog_qid}`}).join(', ')})`,
          // tslint:disable-next-line:max-line-length
          it: `Il codice del catalogo deve avere un qualificatore \'catalogo\' che faccia riferimento al catalogo documentato nei metadati della località. (${_.map(locations, (l, name) => {return `${l.name} : ${l.operator_fountain_catalog_qid}`}).join(', ')})`,
          // tslint:disable-next-line:max-line-length
          tr: `Katalog kodunun kiralık üstveride kataloğa kaydetmek için kataloğu olmalı. (${_.map (locations, (l, name) => {return `${l.name}: ${l.operator_fountain_catalog_qid}`}). join (', ')}) `
          },
        value_translation: catCodes => {
          // loop through all catalog codes to find the right one
          for (let code of catCodes) {
            // return value only if qualifier matches the operator id
            if (_.map(locations, 'operator_fountain_catalog_qid').indexOf(code.qualifiers['P972'][0]) >= 0) {
              return code.value;
            }
          }
          // if no match was found, return null
          return null;
        },
      },
      osm: {
        src_path: ['properties', 'ref'],
        src_instructions: {
          en: ['tag', 'ref'],
          de: ['Attribut', 'ref'],
          fr: ['Attribut', 'ref'],
          it: ['Attributo', 'ref'],
          tr: ['Özellik', 'ref']
        },
        src_info: {
          en: 'This tag could also be used for other purposes. We therefore recommend using Wikidata to store this information.',
          de: 'Dieser Tag kann auch für andere Zwecke verwendet werden. Wir empfehlen daher, diese Informationen in Wikidata zu speichern.',
          // tslint:disable-next-line:max-line-length
          fr: 'Cette balise peut également être utilisée à d\'autres fins. Nous vous recommandons donc d\'utiliser Wikidata pour stocker ces informations.',
          // tslint:disable-next-line:max-line-length
          it: 'Questo tag può essere utilizzato per altri propositi. Di conseguenza raccomandiamo di usare Wikidata al fine di salvare questa informazione.',
          tr: 'Bu etiket başka amaçlar için de kullanılabilir. Biz bu yüzden bilgi depolamak için Wikidata kullanılmasını öneriyoruz. '
        },
        value_translation: identity
      }
    }
  },
  id_wikidata: {
    name: {
      en: 'ID (Wikidata)',
      de: 'ID (Wikidata)',
      fr: 'ID (Wikidata)',
      it: 'ID (Wikidata)',
      tr: 'ID (Wikidata)'
    },
    essential: true,
    type: 'string',
    descriptions: {
      en: 'Identifier used by Wikidata for the fountain.',
      de: 'Kennung, die von Wikidata für den Brunnen verwendet wird.',
      fr: 'Identifiant utilisé par Wikidata pour la fontaine.',
      it: 'Identificatore utilizzato da Wikidata per la fontana.',
      tr: 'Tanımlayıcı, Wikidata tarafından çeşmeler için kullanıldı.'
    },
    src_pref: ['wikidata', 'osm'],
    src_config: {
      wikidata: {
        help: 'https://www.wikidata.org/wiki/Wikidata:Identifiers',
        src_path: ['id'],
        src_instructions: {
          en: ['-'],
          de: ['-'],
          fr: ['-'],
          it: ['-'],
          tr: ['-']
        },
        src_info: {
          en: 'The Wikidata identifier cannot be modified. It uniquely identifies a Wikidata entity.',
          de: 'Der Wikidata-Identifikator kann nicht geändert werden. Es identifiziert eine Wikidata-Entität eindeutig.',
          fr: 'L\'identifiant Wikidata ne peut pas être modifié. Il identifie de manière unique une entité Wikidata.',
          it: 'L\'identificatore di Wikidata non può essere modificato. Esso identifica unicamente un\'entità di Wikidata.',
          tr: 'Wikidata kimliği değiştirilemez. Ona has bir şekilde Wikidata varlığında tanımlanır.'
        },
        value_translation: identity
      },
      osm: {
        src_path: ['properties', 'wikidata'],
        src_instructions: {
          en: ['tag', 'wikidata'],
          de: ['Attribut', 'wikidata'],
          fr: ['Attribut', 'wikidata'],
          it: ['Attributo', 'wikidata'],
          tr: ['Özellik', 'wikidata']
        },
        value_translation: identity
      }
    }
  },
  construction_date: {
    name: {
      en: 'construction date',
      de: 'Baujahr',
      fr: 'date de construction',
      it: 'data di costruzione',
      tr: 'yapım tarihi'
    },
    essential: true,
    type: 'number',
    descriptions: {
      en: 'Year the fountain was constructed.',
      de: 'Baujahr des Brunnens.',
      fr: 'Année de construction de la fontaine.',
      it: 'Anno di costruzione della fontana.',
      tr: 'Çeşmenin inşa edildiği yıl.'
    },
    src_pref: ['wikidata', 'osm'],
    src_config: {
      wikidata: {
        src_path: ['claims', 'P571'],
        src_instructions: {
          en: ['Statement', 'inception'],
          de: ['Aussage', 'Gründung, Erstellung bzw. Entstehung'],
          fr: ['Déclaration', 'date de fondation ou de création'],
          it: ['Dichiarazione', 'data di fondazione o creazione'],
          tr: ['Tanım', 'başlangıç']
        },
        extraction_info: {
          en: 'Only the first value returned by wikidata is kept.',
          de: 'Nur der erste Wert, der von Wikidata zurückgegeben wird, bleibt erhalten.',
          fr: 'Seule la première valeur retournée par wikidata est conservée.',
          it: 'Solo il primo valore ritornato da wikidata sarà conservato.',
          tr: 'Sadece Wikidata\'dan geri gelen ilk değer saklandı.'
        },
        value_translation: values => {
          // just keep the year first date
          return parseInt(values[0].value.substring(0, 4));
        }
      },
      osm: {
        src_path: ['properties', 'start_date'],
        src_instructions: {
          en: ['tag', 'start_date'],
          de: ['Attribut', 'start_date'],
          fr: ['Attribut', 'start_date'],
          it: ['Attributo', 'start_date'],
          tr: ['Özellik', 'start_date']
        },
        value_translation: identity
      }
    }
  },
  removal_date: {
    name: {
      en: 'removal date',
      de: 'Entfernungsdatum',
      fr: 'date d\'enlèvement',
      it: 'data di rimozione',
      tr: 'kaldırılma tarihi'
    },
    essential: true,
    type: 'number',
    descriptions: {
      en: 'Year the fountain was removed.',
      de: 'Entfernungsjahr des Brunnens.',
      fr: 'Année d\'enlèvement de la fontaine.',
      it: 'Anno di rimozione della fontana.',
      tr: 'Çeşmenin yıkıldığı yıl.'
    },
    src_pref: ['wikidata'],
    src_config: {
      osm: null,
      wikidata: {
        src_path: ['claims', 'P576'],
        src_instructions: {
          en: ['Statement', 'dissolved, abolished or demolished'],
          de: ['Aussage', 'Auflösungsdatum'],
          fr: ['Déclaration', 'date de dissolution ou de démolition'],
          it: ['Dichiarazione', 'data di dissoluzione, abolizione o demolizione'],
          tr: ['Tanım', 'dağıtıldı, kaldırıldı veya yıkıldı']
        },
        extraction_info: {
          en: 'Only the first value returned by wikidata is kept.',
          de: 'Nur der erste Wert, der von Wikidata zurückgegeben wird, bleibt erhalten.',
          fr: 'Seule la première valeur retournée par wikidata est conservée.',
          it: 'Solo il primo valore ritornato da wikidata sarà conservato.',
          tr: 'Sadece Wikidata\'dan geri gelen ilk değer saklandı.'
        },
        value_translation: values => {
          // just keep the year of the first date returned
          return parseInt(values[0].value.substring(0, 4));
        }
      }
    }
  },
  artist_name: {
    name: {
      en: 'artist name',
      de: 'Name des Künstlers',
      fr: 'nom de l\'artiste',
      it: 'nome dell\'artista',
      tr: 'mimar ismi '
    },
    essential: true,
    type: 'string',
    descriptions: {
      en: 'Name of the artist who created or designed the fountain.',
      de: 'Der Name des Künstlers, der den Brunnen erschaffen hat.',
      fr: 'Nom de l\'artiste qui a créé ou conçu la fontaine.',
      it: 'Nome dell\' artista che ha creato o progettato la fontana.',
      tr: 'Çeşmeyi yapan veya tasarlayan mimarın ismi. '
    },
    src_pref: ['wikidata', 'osm'],
    src_config: {
      wikidata: {
        src_path: ['claims', 'P170'],
        src_instructions: {
          en: ['Statement', 'creator'],
          de: ['Aussage', 'Urheber'],
          fr: ['Déclaration', 'créateur'],
          it: ['Dichiarazione', 'creatore'],
          tr: ['Tanım', 'mimar']
        },
        extraction_info: {
          // tslint:disable-next-line:max-line-length
          en: 'Only the first value returned by Wikidata is kept. If the QID corresponds to that of "anonymous" (Q4233718), it returns null.',
          // tslint:disable-next-line:max-line-length
          de: 'Nur der erste Wert, der von Wikidata zurückgegeben wird, bleibt erhalten. Wenn die QID der von "Anonymus" (Q4233718) entspricht, ist der Wert "null".',
          // tslint:disable-next-line:max-line-length
          fr: 'Seule la première valeur retournée par Wikidata est conservée. Si le QID correspond à celui de "anonyme" (Q4233718), la valeur retournée est "null".',
          // tslint:disable-next-line:max-line-length
          it: 'Solo il primo valore ritornato da wikidata sarà conservato. Se il QID corrisponde a quello di "anonimo" (Q4233718), il valore ritornato è "null".',
          // tslint:disable-next-line:max-line-length
          tr: 'Sadece Wikidata\'dan geri gelen ilk değer saklandı. Eğer QID "anonim" (Q4233718) \'e karşılık verirse\' geçersiz döner.'
        },
        value_translation: values => {
          // just return the first value that is not anonymous.
          for (let value of values){
            if (value.value !== 'Q4233718') {
              return value.value;
            }
          }
          // fix for https://github.com/water-fountains/proximap/issues/129
          return null;

        }
      },
      osm: {
        src_path: ['properties', 'artist_name'],
        src_instructions: {
          en: ['tag', 'artist_name'],
          de: ['Attribut', 'artist_name'],
          fr: ['Attribut', 'artist_name'],
          it: ['Attributo', 'artist_name'],
          tr: ['Özellik', 'artist_name']
        },
        extraction_info: {
          en: 'Only the first value is kept.',
          de: 'Nur der erste Wert, der zurückgegeben wird, bleibt erhalten.',
          fr: 'Seule la première valeur retournée est conservée.',
          it: 'Solo il primo valore sarà conservato.',
          tr: 'Yalnızca ilk değer korunur.'
        },
        value_translation: text => {
          return text.split(';')[0];
        }
      }
    }
  },
  availability: {
    name: {
      en: 'availability',
      de: 'aktiver Zeitraum',
      fr: 'disponibilité',
      it: 'disponibilità',
      tr: 'uygunluk'
    },
    essential: false,
    type: 'string',
    descriptions: {
      en: 'Times of the year during which the fountain is running.',
      de: 'Zeiten des Jahres, in denen der Brunnen läuft.',
      fr: 'Périodes de l\'année durant lesquelles la fontaine fonctionne.',
      it: 'Periodi dell\'anno durante i quali la fontana è in funzione.',
      tr: 'Çeşmenin çalıştığı zamanlar. '
    },
    src_pref: ['osm'],
    src_config: {
      osm: {
        src_path: ['properties', 'opening_hours'],
        src_instructions: {
          en: ['tag', 'opening_hours'],
          de: ['Attribut', 'opening_hours'],
          fr: ['Attribut', 'opening_hours'],
          it: ['Attributo', 'opening_hours'],
          tr: ['Özellik', 'opening_hours']
        },
        src_info: {
          en: 'Date range must be in English. Example: "March-November"',
          de: 'Muss auf Englisch sein. Beispiel: "March-November"',
          fr: 'Doit être en anglais. Exemple: "March-November"',
          it: 'Deve essere in inglese. Esempio:  "March-November"',
          tr: 'Zaman aralığı İngilizce olmalı. Örnek: "March-November" '
        },
        value_translation: identity
      },
      wikidata: null
    }
  },
  floor_level: {
    name: {
      en: 'floor',
      de: 'Stockwerk',
      fr: 'niveau',
      it: 'piano',
      tr: 'taban'
    },
    essential: false,
    type: 'string',
    descriptions: {
      en: 'Floor at which the fountain is situated.',
      de: 'Stockwerk, auf dem sich der Brunnen befindet.',
      fr: 'L\'étage où se trouve la fontaine.',
      it: 'Il piano in cui si trova la fontana.',
      tr: 'Çeşmenin bulunduğu taban.'
    },
    src_pref: ['osm'],
    src_config: {
      osm: {
        src_path: ['properties', 'level'],
        src_instructions: {
          en: ['tag', 'level'],
          de: ['Attribut', 'level'],
          fr: ['Attribut', 'level'],
          it: ['Attributo', 'level'],
          tr: ['Özellik', 'level']
        },
        value_translation: identity
      },
      wikidata: null
    }
  },
  fixme: {
    name: {
      en: 'data errors',
      de: 'Datenfehler',
      fr: 'erreurs de données',
      it: 'Errore dei dati',
      tr: 'veri hataları'
    },
    essential: false,
    type: 'string',
    descriptions: {
      en: 'Property used in OpenStreetMap to indicate if there might be data issues.',
      de: 'Eigenschaft, die in OpenStreetMap verwendet wird, um anzuzeigen, ob es Datenprobleme geben könnte.',
      fr: 'Propriété utilisée dans OpenStreetMap pour indiquer s\'il y a des problèmes de données.',
      it: 'Proprietà usata in OpenStreetMap per indicare se ci possono essere problemi con i dati.',
      tr: 'Eğer veri sorunları varsa özellik OpenStreetMap\'de gösterilmek için kullanılır.'
    },
    src_pref: ['osm'],
    src_config: {
      osm: {
        src_path: ['properties', 'fixme'],
        src_instructions: {
          en: ['tag', 'fixme'],
          de: ['Attribut', 'fixme'],
          fr: ['Attribut', 'fixme'],
          it: ['Attribut', 'fixme'],
          tr: ['Özellik', 'fixme']
        },
        value_translation: identity
      },
      wikidata: null
    }
  },
  directions: {
    name: {
      en: 'location',
      de: 'Lage',
      fr: 'emplacement',
      it: 'località',
      tr: 'yer'
    },
    essential: true,
    type: 'string',
    descriptions: {
      en: 'Directions to or address of fountain. [example: near Kappenbühlstrasse 74]',
      de: 'Wegbeschreibung oder Adresse des Brunnens. [Beispiel: near Kappenbühlstrasse 74]',
      fr: 'Itinéraire pour se rendre à la fontaine ou adresse de la fontaine. [exemple: near Kappenbühlstrasse 74]',
      it: 'Indicazioni per raggiungere la fontana o il suo indirizzo. [esempio: near Kappenbühlstrasse 74]',
      tr: 'Çeşmenin yönlendirmeleri veya adresi. [örnek: near Kappenbühlstrasse 74]'
    },
    src_pref: ['wikidata'],
    src_config: {
      osm: null,
      wikidata: {
        src_path: ['claims', 'P2795'],
        src_instructions: {
          en: ['Statement', 'directions'],
          de: ['Aussage', 'Wegbeschreibung'],
          fr: ['Déclaration', 'instructions pour s\'y rendre'],
          it: ['Dichiarazione', 'indicazioni per raggiungere la fontana'],
          tr: ['Tanım', 'yönlendirmeler']
        },
        extraction_info: {
          en: 'Only first value returned by Wikidata is kept.',
          de: 'Nur der erste Wert, der von Wikidata zurückgegeben wird, bleibt erhalten.',
          fr: 'Seule la première valeur retournée par Wikidata est conservée.',
          it: 'Solo il primo valore ritornato da wikidata sarà conservato.',
          tr: 'Sadece Wikidata\'dan geri gelen ilk değer saklandı.'
        },
        value_translation: values => {
          // just keep the first name
          return values[0].value;
        }
      }
    }
  },
  pano_url: {
    name: {
      en: 'panorama URLs',
      de: 'Panorama-URLs',
      fr: 'URL des panoramas',
      it: 'URL del panorama',
      tr: 'panorama URL\'leri'
    },
    essential: false,
    type: 'object',
    descriptions: {
      en: 'URLs to street-level views of the fountain.',
      de: 'URLs zu Straßenansichten des Brunnens.',
      fr: 'URLs vers les images de la fontaine au niveau de la rue.',
      it: 'URL per le immagini a livello strada della fontana.',
      tr: 'Çeşmenin sokak seviyesinden görüntülerinin URL\'leri.'
    },
    src_pref: ['wikidata'],
    src_config: {
      osm: null,
      wikidata: {
        src_path: ['claims', 'P5282'],
        src_instructions: {
          en: ['Statement', 'ground level 360 degree view'],
          de: ['Aussage', 'Bodennahe 360-Grad-Ansicht'],
          fr: ['Déclaration', 'vue à 360 degrés depuis le sol'],
          it: ['Dichiarazione', 'vista a 360 gradi da terra'],
          tr: ['Tanım', '360 derece yer seviyesi görünümü']
        },
        extraction_info: {
          en: 'The source of the imagery is determined automatically on the basis of the url.',
          de: 'Die Quelle der Bilder wird automatisch anhand der URL ermittelt.',
          fr: 'La source de l\'imagerie est déterminée automatiquement sur la base de l\'url.',
          it: 'La fonte delle immagini è determinata automaticamente in base all\'url.',
          tr: 'Görüntü kaynağı URL temelinde otomatik olarak belirlenir. '
        },
        value_translation: (list) => {
          return _.map(list, el => {
            const url = el.value;
            // determine source from url
            let source_name = 'unknown';
            if (url.includes('goo.gl/maps')) {
              source_name = 'Google Street View';
           // }else if(url.includes('instantstreetview')){
              // a first step towards https://github.com/water-fountains/proximap/issues/137
             // source_name = 'Google Street View (+)';
            } else if (url.includes('mapillary')) {
              source_name = 'Mapillary';
            } else if (url.includes('openstreetcam')) {
              source_name = 'OpenStreetCam';
            }
            return {
              source_name: source_name,
              url: url
            };
          });
        }
      }
    }
  },
  featured_image_name: {
    name: {
      en: 'featured image',
      de: 'Hauptbild',
      fr: 'image principal',
      it: 'immagine pricipale',
      tr: 'esas görüntü'
    },
    essential: false,
    type: 'string',
    descriptions: {
      // tslint:disable-next-line:max-line-length
      en: 'Name of the featured image as documented in Wikidata. This is useful for creating the gallery object, but otherwise not used directly.',
      // tslint:disable-next-line:max-line-length
      de: 'Name des Hauptbildes, wie in Wikidata dokumentiert. Dies ist nützlich für die Erstellung des Galerie-Objekts, wird aber ansonsten nicht direkt verwendet.',
      // tslint:disable-next-line:max-line-length
      fr: 'Nom de l\'image principale tel que documenté dans Wikidata. Ceci est utile pour créer l\'objet de la galerie, mais n\'est pas utilisé directement.',
      // tslint:disable-next-line:max-line-length
      it: 'Nome dell\'immaigine principale come documentato in Wikidata. Questo è utile per creare l\'oggetto della galleria, ma altrimenti non viene usato direttamente.',
      // tslint:disable-next-line:max-line-length
      tr: 'Esas görüntünün Wikidata\'daki ismi. Bu bir nesne galerisi oluşturmak için gereklidir, aksi takdirde doğrudan kullanılmaz. '
    },
    src_pref: ['wikidata'],
    src_config: {
      osm: {
        src_info: {
          en: 'Value is only taken if it contains "File:".',
          de: 'Wert wird nur genommen wenn es "File:" beinhaltet.',
          fr: 'La valeur est seulement acceptée si elle contient "File:" pour indiquer qu\'il s\'agit d\'un fichier.',
          it: 'Il valore viene accettato solamente se contiene "File:" per indicare che si tratta di un file.',
          tr: 'Değer yalnızca eğer " File: " içerirse kabul edilir.'
        },
        src_path: ['properties', 'wikimedia_commons'],
        src_instructions: {
          en: ['tag', 'wikimedia_commons'],
          de: ['Attribut', 'wikimedia_commons'],
          fr: ['Attribut', 'wikimedia_commons'],
          it: ['Attributi', 'wikimedia_commons'],
          tr: ['Özellik', 'wikimedia_commons']
        },
        value_translation: text => {
          if (text.includes('File:')) {
            return text.replace('File:', '');
          } else {
            return null;
          }}
      },
      wikidata: {
        src_path: ['claims', 'P18'],
        src_instructions: {
          en: ['Statement', 'image'],
          de: ['Aussage', 'Bild'],
          fr: ['Déclaration', 'image'],
          it: ['Dichiarazione', 'immagine'],
          tr: ['Tanım', 'görüntü']
        },
        extraction_info: {
          en: 'Only the first value returned by Wikidata is kept.',
          de: 'Nur der erste Wert, der von Wikidata zurückgegeben wird, bleibt erhalten.',
          fr: 'Seule la première valeur retournée par Wikidata est conservée.',
          it: 'Solo il primo valore ritornato da wikidata sarà conservato.',
          tr: 'yalnızca Wikidata tarafından gönderilen değer tutulur.'
        },
        value_translation: values => {
          const img = { src: 'wd',
                      imgs: values };
          return img;
        }
      }
    }
  },
  coords: {
    name: {
      en: 'coordinates',
      de: 'Koordinaten',
      fr: 'coordonnées',
      it: 'coordinate',
      tr: 'koordinat'
    },
    essential: false,
    type: 'coords',
    descriptions: {
      // tslint:disable-next-line:max-line-length
      en: 'Geographical coordinates at which the fountain is located, expressed as an array of longitude and latitude (in that order).',
      // tslint:disable-next-line:max-line-length
      de: 'Geographische Koordinaten, an denen sich der Brunnen befindet, ausgedrückt als eine Liste von Längen- und Breitengrad (in dieser Reihenfolge).',
      // tslint:disable-next-line:max-line-length
      fr: 'Coordonnées géographiques où se trouve la fontaine, exprimées sous la forme d\'une liste contenant la longitude et la latitude (dans cet ordre).',
      // tslint:disable-next-line:max-line-length
      it: 'Coordinate geografiche dove si trova la fontana, espresse in una lista contenente longitudine e latitudine (in questo ordine).',
      // tslint:disable-next-line:max-line-length
      tr: 'Çeşmenin bulunduğu yerin Coğrafya koordinatları bir boylam ve enlem dizisi olarak tanımlanır.'
    },
    src_pref: ['osm', 'wikidata'],
    src_config: {
      wikidata: {
        src_path: ['claims', 'P625'],
        src_instructions: {
          en: ['Statement', 'coodinate location'],
          de: ['Aussage', 'geographische Koordinaten'],
          fr: ['Déclaration', 'coordonnées géographiques'],
          it: ['Dichiarazione', 'coordinate geografiche'],
          tr: ['Tanım', 'Coğrafya Koordinatı']
        },
        src_info: {
          en: 'Geographical coordinates are to be expressed as an array of longitude and latitude (in that order).',
          de: 'Geographische Koordinaten müssen eingetragen werden als eine Liste von Längen- und Breitengrad (in dieser Reihenfolge).',
          // tslint:disable-next-line:max-line-length
          fr: 'Les coordonnées géographiques doivent être exprimées sous la forme d\'une liste contenant la longitude et la latitude (dans cet ordre).',
          it: 'Le coordinate geografiche devono essere espresse in una lista contenente longitudine e latitudine (in questo ordine).',
          tr: 'Coğrafya koordinatları bir boylam ve enlem dizisi olarak tanımlanır.'
        },
        extraction_info: {
          en: 'The order of coordinates is reversed to match the longitude-latitude format.',
          de: 'Die Reihenfolge der Koordinaten wird umgekehrt, um dem Längen- und Breitenformat zu entsprechen.',
          fr: 'L\'ordre des coordonnées est inversé pour correspondre au format longitude-latitude.',
          it: 'L\'ordine delle coordinate è invertito per corrispondere al formato longitudine-latitudine',
          tr: 'Sıra koordinatı boylam-enlem formatı olarak ters çevrilir.'
        },
        value_translation: coordList => {
          // return coords in lng lat format !! reverse will mutate array
          try {
            // for #212, sometimes no coords exist
            return coordList[0].value.slice().reverse();
          } catch (e) {
            return null;
          }
        }
      },
      osm: {
        help: 'https://wiki.openstreetmap.org/wiki/Elements',
        src_path: ['geometry', 'coordinates'],
        src_instructions: {
          en: ['-'],
          de: ['-'],
          fr: ['-'],
          it: ['-'],
          tr: ['-']
        },
        src_info: {
          en: 'Fountain coordinates in OpenStreetMap can be changed by dragging the fountain in the map editor.',
          de: 'Die Fontänenkoordinaten in OpenStreetMap können durch Ziehen des Brunnens im Karteneditor geändert werden.',
          // tslint:disable-next-line:max-line-length
          fr: 'Les coordonnées de la fontaine dans OpenStreetMap peuvent être modifiées en faisant glisser la fontaine dans l\'éditeur de carte.',
          it: 'Le coordinate della fontana in OpenStreetMap possono essere cambiate trascinando la fontana sull\'editor della mappa.',
          tr: 'Çeşmenin koordinatları OpenStreetMap içinde çeşmeyi harita içinde sürükleyerek değiştirilebilir.'
        },
        value_translation: identity
      }
    }
  },
  water_type: {
    name: {
      en: 'water type',
      de: 'Wasserart',
      fr: 'type d\'eau',
      it: 'tipo d\'acqua',
      tr: 'su tipi '
    },
    essential: true,
    type: 'string',
    descriptions: {
      en: 'Type of water that the fountain provides, for example tap water, springwater, or groundwater.',
      de: 'Art des Wassers, das der Brunnen liefert, z.B. Leitungswasser, Quellwasser oder Grundwasser.',
      fr: 'Type d\'eau que la fontaine fournit, par exemple l\'eau du robinet, l\'eau de source ou l\'eau souterraine.',
      it: 'Tipo d\'acqua che la fontana fornisce, per esempio acqua di rubinetto, acqua di sorgente o acqua di falda.',
      tr: 'Çeşmeden akan suyun tipi, örneğin musluk suyu, kaynak suyu veya yeraltı suyu.'
    },
    src_pref: ['wikidata', 'osm'],
    src_config: {
      wikidata: {
        src_path: ['claims', 'P5623'],
        src_instructions: {
          en: ['Statement', 'type of water supply'],
          de: ['Aussage', 'Art der Wasserversorgung'],
          fr: ['Déclaration', 'type d\'alimentation en eau'],
          it: ['Dichiarazione', 'tipo di fornitura d\'acqua'],
          tr: ['Tanım', 'Su kaynağının tipi']
        },
        extraction_info: {
          en: 'The Wikidata QIDs of the water quality are directly translated into keyword values.',
          de: 'Die Wikidata-QIDs der Wasserqualität werden direkt in Keyword-Werte übersetzt.',
          fr: 'Les QID Wikidata de la qualité de l\'eau sont directement traduits en valeurs de mots-clés.',
          it: 'I Wikidata QIDs della qualità dell\'acqua sono direttamente tradotti in valori di parole chiave.',
          tr: 'Wikidata su kalitesi QID\'leri klavye değerlerine doğrudan çevrilir. '
        },
        value_translation: vals => {
          switch (vals[0].value) {
            case 'Q53633635':
              return 'tapwater';
            case 'Q1881858':
              return 'springwater';
            case 'Q53634173':
              return 'own_supply';
            case 'Q161598':
              return 'groundwater';
            default:
              return vals[0].value;
          }
        }
      },
      osm: {
        src_path: ['properties', 'drinking_water:description'],
        src_instructions: {
          en: ['tag', 'drinking_water:description'],
          de: ['Attribut', 'drinking_water:description'],
          fr: ['Attribut', 'drinking_water:description'],
          it: ['Attributo', 'drinking_water:description'],
          tr: ['Özellik', 'drinking_water:description']
        },
        src_info: {
          en: 'This attribute can also be used for other purposes.',
          de: 'Dieses Attribut kann auch für andere Zwecke verwendet werden.',
          fr: 'Cet attribut peut également être utilisé à d\'autres fins.',
          it: 'Questo attributo può essere utilizzato per altri propositi.',
          tr: 'Bu özellik başka amaçlar için kullanılabilir.'
        },
        extraction_info: {
          en: 'The values known to occur in OpenStreetMap are translated into keyword values.',
          de: 'Die in OpenStreetMap bekannten Werte werden in Schlüsselwortwerte umgewandelt.',
          fr: 'Les valeurs connues dans OpenStreetMap sont traduites en valeurs de mots-clés.',
          it: 'I valori conosciuti in OpenStreetMap sono tradotti in valori di parole chiave.',
          tr: 'OpenStreetMap da olan ?? değerleri klavye değerlerine çevrilir.'
        },
        value_translation: value => {
          switch (value) {
            case 'Leitungswasser':
              return 'tapwater';
            case 'Quellwasser':
              return 'springwater';
            case 'eigene Versorgung':
              return 'own_supply';
            case 'Grundwasser':
              return 'groundwater';
            default:
              return value;
          }
        }
      }
    }
  },
  wiki_commons_name: {
    name: {
      en: 'Wikimedia Commons category',
      de: 'Wikicommons-Kategorie',
      fr: 'catégorie Wikimedia Commons',
      it: 'categoria di Wikimedia Commons',
      tr: 'Wikimedia Commons kategorisi'
    },
    essential: false,
    type: 'string',
    descriptions: {
      en: 'Name of the Wikimedia Commons page of the fountain.',
      de: 'Name der Wikimedia Commons-Seite des Brunnens.',
      fr: 'Nom de la page Wikimedia Commons de la fontaine.',
      it: 'Nome della pagina Wikimedia Commons della fontana.',
      tr: 'Çeşmenin Wikimedia Commons sayfasındaki ismi.'
    },
    src_pref: ['wikidata', 'osm'],
    src_config: {
      wikidata: {
        src_path: ['claims', 'P373'],
        src_instructions: {
          en: ['Statement', 'Commons category'],
          de: ['Aussage', 'Commons-Kategorie'],
          fr: ['Déclaration', 'catégorie Commons'],
          it: ['Dichiarazione', 'categoria Commons'],
          tr: ['Tanım', 'Commons kategori']
        },
        src_info: {
          en: 'This property can also be defined as a Sitelink, but the Statement value will be used first',
          de: 'Diese Eigenschaft kann auch als Interwiki-Link definiert werden, aber der Statement Wert wird zuerst verwendet.',
          fr: 'Cette propriété peut aussi être définie comme un Liens de site, mais la valeur du Statement sera utilisée en premier.',
          it: 'Questa proprietà può essere definita come un link a un sito, ma il valore di Statement sarà usato per primo.',
          tr: 'Bu özellik aynı zamanda bir Site Bağlantısı olarak tanımlanabilir , ama önce Tanım değeri kullanılır.'
        },
        src_path_extra: ['sitelinks', 'commonswiki'],
        extraction_info: {
          en: 'Only the first value returned is used.',
          de: 'Es wird nur der erste zurückgegebene Wert verwendet.',
          fr: 'Seule la première valeur retournée est utilisée.',
          it: 'Solo il primo valore ritornato è utilizzato.',
          tr: 'Yalnızca gönderilen ilk değer kullanılır.'
        },
        value_translation: values => {
          let cats = [];
          if (null != values) {
            for (let i = 0; i < values.length; i++) {
              let c = values[i].value; // we don't need the qualifiers here
                    let cat = {
                      s: 'wd',
                      c: c
                    };
                    cats.push(cat);
            }
          }
            return cats;
        },
        value_translation_extra: text=>{
        let cats = [];
        if (null != text) {
            const txt = text.replace('Category:', '');
            if (null != txt && txt.trim() != '') {
                  let cat = { s: 'wd',
                            c: txt };
                  cats.push(cat);
          }
        }
            return cats;
        }
      },
      osm: {
        src_info: {
          en: 'Value is only taken if it contains "Category:".',
          de: 'Wert wird nur genommen wenn es "Category:" beinhaltet.',
          fr: 'La valeur est seulement acceptée si elle contient "Category:" pour indiquer qu\'il s\'agit d\'une catégorie.',
          it: 'Il valore è accettato solo se contiene "Category:", per indicare che si tratta di una categoria.',
          tr: 'Değer yalnızca  Category: .'
        },
        src_path: ['properties', 'wikimedia_commons'],
        src_instructions: {
          en: ['tag', 'wikimedia_commons'],
          de: ['Attribut', 'wikimedia_commons'],
          fr: ['Attribut', 'wikimedia_commons'],
          it: ['Attributo', 'wikimedia_commons'],
          tr: ['Özellik', 'wikimedia_commons']
        },
        value_translation: text=>{
            let cats = [];
            if (text.includes('Category:')) {
            if (null != text) {
                const txt = text.replace('Category:', '');
                if (null != txt && txt.trim()!= '') {
                      let cat = { s: 'osm',
                                c: txt };
                      cats.push(cat);
              }
            }
          }
          return cats;
        }
      }
    }
  },
  wikipedia_en_url: {
    name: {
      en: 'Wikipedia page in English',
      de: 'Wikipediaseite auf Englisch',
      fr: 'page Wikipédia en anglais',
      it: 'pagina Wikipedia in inglese',
      tr: 'İngilizce Wikiopedia sayfası'
    },
    essential: true,
    type: 'url',
    descriptions: {
      en: 'URL of the fountain Wikipedia page in English.',
      de: 'URL der Brunnen-Wikipedia-Seite auf Englisch.',
      fr: 'URL de la page de la fontaine Wikipedia en anglais.',
      it: 'URL della pagina Wikipedia della fontana in inglese.',
      tr: 'Çeşmenin Wikipedia İngilizce sayfasının URL\'i.'
    },
    src_pref: ['wikidata', 'osm'],
    src_config: {
      wikidata: {
        help: 'https://www.wikidata.org/wiki/Help:Sitelinks',
        src_path: ['sitelinks', 'enwiki'],
        src_instructions: {
          en: ['Wikipedia', 'en'],
          de: ['Wikipedia', 'en'],
          fr: ['Wikipédia', 'en'],
          it: ['Wikipedia', 'en'],
          tr: ['Wikipedia', 'en']
        },
        value_translation: name => {
          return `https://en.wikipedia.org/wiki/${name}`;
        }
      },
      osm: {
        src_path: ['properties', 'wikipedia'],
        src_instructions: {
          en: ['tag', 'wikipedia'],
          de: ['Attribut', 'wikipedia'],
          fr: ['Attribut', 'wikipedia'],
          it: ['Attribut', 'wikipedia'],
          tr: ['Özellik', 'wikipedia']
        },
        src_info: {
          en: 'The name of the wikipedia page must be prefixed with the language locale code. Example: "fr:Jet d\'eau de Genève"',
          de: 'Der Name der Wikipedia-Seite muss mit dem Sprachumgebungscode vorangestellt werden. Beispiel: " fr:Jet d\'eau de Genève"',
          fr: 'Le nom de la page wikipedia doit être préfixé avec le code de la langue locale. Exemple : "fr:Jet d\'eau de Genève"',
          // tslint:disable-next-line:max-line-length
          it: 'Il nome della pagina Wikipedia deve essere prefissato con il nome del linguaggio locale. Esempio: "fr:Jet d\'eau de Genève"' ,
          tr: 'Wikipedia sayfasının ismi yerel dil koduyla oluşturulmalıdır. Örneğin: "tr:Bergama suyunun jeti"'
        },
        extraction_info: {
          en: 'Only values with language locale code "en" are retained and turned into a URL.',
          de: 'Nur Werte mit dem Sprachumgebungscode "en" werden beibehalten und in eine URL umgewandelt.',
          fr: 'Seules les valeurs avec le code local de langue "fr" sont conservées et transformées en URL.',
          it: 'Solo i valori con codice del linguaggio locale "en" saranno convervati e trasformati in URL.',
        tr: 'Yalnizca yerel dil kodlu "fr" değerleri tutulur ve bir URL\'e çevrilir.'
        },
        value_translation: val => {
          let parts = val.split(':');
          if (parts[0] === 'en') {
            return `https://en.wikipedia.org/wiki/${parts[1]}`;
          } else {
            return null;
          }
        }
      }
    }
  },
  wikipedia_de_url: {
    name: {
      en: 'Wikipedia page in German',
      de: 'Wikipediaseite auf Deutsch',
      fr: 'page Wikipédia en allemand',
      it: 'pagina Wikipedia in tedesco',
      tr: 'Almanca Wikipedia sayfası'
    },
    essential: true,
    type: 'url',
    descriptions: {
      en: 'URL of the fountain Wikipedia page in German.',
      de: 'URL der Brunnen-Wikipedia-Seite auf Deutsch.',
      fr: 'URL de la page de la fontaine Wikipedia en allemand.',
      it: 'URL della pagina Wikipedia della fontana in tedesco.',
      tr: 'Almanca Wikipedia çeşme sayfasının URLi.'
    },
    src_pref: ['wikidata', 'osm'],
    src_config: {
      wikidata: {
        help: 'https://www.wikidata.org/wiki/Help:Sitelinks',
        src_path: ['sitelinks', 'dewiki'],
        src_instructions: {
          en: ['Wikipedia', 'de'],
          de: ['Wikipedia', 'de'],
          fr: ['Wikipédia', 'de'],
          it: ['Wikipedia', 'de'],
          tr: ['Wikipedia', 'de']
        },
        value_translation: name => {
          return `https://de.wikipedia.org/wiki/${name}`;
        }
      },
      osm: {
        src_path: ['properties', 'wikipedia'],
        src_instructions: {
          en: ['tag', 'wikipedia'],
          de: ['Attribut', 'wikipedia'],
          fr: ['Attribut', 'wikipedia'],
          it: ['Attributo', 'wikipedia'],
          tr: ['Özellik', 'wikipedia']
        },
        src_info: {
          en: 'The name of the wikipedia page must be prefixed with the language locale code. Example: "fr:Jet d\'eau de Genève"',
          de: 'Der Name der Wikipedia-Seite muss mit dem Sprachumgebungscode vorangestellt werden. Beispiel: " fr:Jet d\'eau de Genève"',
          fr: 'Le nom de la page wikipedia doit être préfixé avec le code de la langue locale. Exemple : "fr:Jet d\'eau de Genève"',
          // tslint:disable-next-line:max-line-length
          it: 'Il nome della pagina Wikipedia deve essere prefissato con il nome del linguaggio locale. Esempio: "fr:Jet d\'eau de Genève"' ,
          tr: 'Wikipedia sayfasının ismi yerel dil koduyla oluşturulmalıdır. Örneğin: "tr: Bergama suyunun jeti" '
        },
        extraction_info: {
          en: 'Only values with language locale code "de" are retained and turned into a URL.',
          de: 'Nur Werte mit dem Sprachumgebungscode "de" werden beibehalten und in eine URL umgewandelt.',
          fr: 'Seules les valeurs avec le code local de langue "de" sont conservées et transformées en URL.',
          it: 'Solo i valori con codice del linguaggio locale "de" saranno conservati e trasformati in URL.',
          tr: 'Yalnizca yerel dil kodlu "de" değerleri tutulur ve bir URL\'e çevrilir.'
        },
        value_translation: val => {
          let parts = val.split(':');
          if (parts[0] === 'de') {
            return `https://de.wikipedia.org/wiki/${parts[1]}`;
          } else {
            return null;
          }
        }
      }
    }
  },
  wikipedia_fr_url: {
    name: {
      en: 'Wikipedia page in French',
      de: 'Wikipediaseite auf Französisch',
      fr: 'page Wikipédia en français',
      it: 'pagina Wikipedia in francese.',
      tr: 'Fransızca Wikipedia sayfası.'
    },
    essential: true,
    type: 'url',
    descriptions: {
      en: 'URL of the fountain Wikipedia page in French.',
      de: 'URL der Brunnen-Wikipedia-Seite auf Französisch.',
      fr: 'URL de la page de la fontaine Wikipedia en français.',
      it: 'URL della pagina wikipedia in francese.',
      tr: 'Fransızca Wikipedia çeşme sayfasının URL\'i.'
    },
    src_pref: ['wikidata', 'osm'],
    src_config: {
      wikidata: {
        help: 'https://www.wikidata.org/wiki/Help:Sitelinks',
        src_path: ['sitelinks', 'frwiki'],
        src_instructions: {
          en: ['Wikipedia', 'fr'],
          de: ['Wikipedia', 'fr'],
          fr: ['Wikipédia', 'fr'],
          it: ['Wikipedia', 'fr'],
          tr: ['Wikipedia', 'fr']
        },
        value_translation: name => {
          return `https://fr.wikipedia.org/wiki/${name}`;
        }
      },
      osm: {
        src_path: ['properties', 'wikipedia'],
        src_instructions: {
          en: ['tag', 'wikipedia'],
          de: ['Attribut', 'wikipedia'],
          fr: ['Attribut', 'wikipedia'],
          it: ['Attributo', 'wikipedia'],
          tr: ['Özellik', 'wikipedia']
        },
        src_info: {
          en: 'The name of the wikipedia page must be prefixed with the language locale code. Example: "fr:Jet d\'eau de Genève"',
          de: 'Der Name der Wikipedia-Seite muss mit dem Sprachumgebungscode vorangestellt werden. Beispiel: " fr:Jet d\'eau de Genève"',
          fr: 'Le nom de la page wikipedia doit être préfixé avec le code de la langue locale. Exemple : "fr:Jet d\'eau de Genève"',
          // tslint:disable-next-line:max-line-length
          it: 'Il nome della pagina Wikipedia deve essere prefissato con il nome del linguaggio locale. Esempio: "fr:Jet d\'eau de Genève"' ,
          tr: 'Wikipedia sayfasının ismi yerel dil koduyla oluşturulmalıdır. Örneğin: "tr: Bergama suyunun jeti" '
        },
        extraction_info: {
          en: 'Only values with language locale code "fr" are retained and turned into a URL.',
          de: 'Nur Werte mit dem Sprachumgebungscode "fr" werden beibehalten und in eine URL umgewandelt.',
          fr: 'Seules les valeurs avec le code local de langue "fr" sont conservées et transformées en URL.',
          it: 'Solo i valori con codice del linguaggio locale "fr" saranno conservati e trasformati in URL.',
          tr: 'Yalnizca yerel dil kodlu "fr" değerleri tutulur ve bir URL\'e çevrilir.'
        },
        value_translation: val => {
          let parts = val.split(':');
          if (parts[0] === 'fr') {
            return `https://fr.wikipedia.org/wiki/${parts[1]}`;
          } else {
            return null;
          }
        }
      }
    }
  },
  wikipedia_it_url: {
    name: {
      en: 'Wikipedia page in Italian',
      de: 'Wikipediaseite auf Italienisch',
      fr: 'page Wikipédia en italien',
      it: 'pagina Wikipedia in italiano.',
      tr: 'İtalyanca Wikipeda sayfası.'
    },
    essential: true,
    type: 'url',
    descriptions: {
      en: 'URL of the fountain Wikipedia page in Italian.',
      de: 'URL der Brunnen-Wikipedia-Seite auf Italienisch.',
      fr: 'URL de la page de la fontaine Wikipedia en italien.',
      it: 'URL della pagina wikipedia in italiano.',
      tr: 'İtalyanca wikipedia sayfasının URLi.'
    },
    src_pref: ['wikidata', 'osm'],
    src_config: {
      wikidata: {
        help: 'https://www.wikidata.org/wiki/Help:Sitelinks',
        src_path: ['sitelinks', 'itwiki'],
        src_instructions: {
          en: ['Wikipedia', 'it'],
          de: ['Wikipedia', 'it'],
          fr: ['Wikipédia', 'it'],
          it: ['Wikipedia', 'it'],
          tr: ['Wikipedia', 'it']
        },
        value_translation: name => {
          return `https://it.wikipedia.org/wiki/${name}`;
        }
      },
      osm: {
        src_path: ['properties', 'wikipedia'],
        src_instructions: {
          en: ['tag', 'wikipedia'],
          de: ['Attribut', 'wikipedia'],
          fr: ['Attribut', 'wikipedia'],
          it: ['Attributo', 'wikipedia'],
          tr: ['Özellik', 'wikipedia']
        },
        src_info: {
          en: 'The name of the wikipedia page must be prefixed with the language locale code. Example: "it:Jet d\'eau de Genève"',
          de: 'Der Name der Wikipedia-Seite muss mit dem Sprachumgebungscode vorangestellt werden. Beispiel: " it:Jet d\'eau de Genève"',
          fr: 'Le nom de la page wikipedia doit être préfixé avec le code de la langue locale. Exemple : "it:Jet d\'eau de Genève"',
          it: 'Il nome della pagina Wikipedia deve essere prefissato con il nome del linguaggio locale. Esempio: "it:Jet d\'eau de Genève"',
          tr: 'Wikipedia sayfasının ismi yerel dil koduyla oluşturulmalıdır. Örneğin: "tr:Bergama suyunun jeti" '
        },
        extraction_info: {
          en: 'Only values with language locale code "it" are retained and turned into a URL.',
          de: 'Nur Werte mit dem Sprachumgebungscode "it" werden beibehalten und in eine URL umgewandelt.',
          fr: 'Seules les valeurs avec le code local de langue "it" sont conservées et transformées en URL.',
          it: 'Solo i valori con codice del linguaggio locale "it" saranno conservati e trasformati in URL.',
          tr: 'Yalnizca yerel dil kodlu "it" değerleri tutulur ve bir URL\'e çevrilir.'
        },
        value_translation: val => {
          let parts = val.split(':');
          if (parts[0] === 'it') {
            return `https://it.wikipedia.org/wiki/${parts[1]}`;
          } else {
            return null;
          }
        }
      }
    }
  },
  wikipedia_tr_url: {
    name: {
      en: 'Wikipedia page in Turkish',
      de: 'Wikipediaseite auf Türkisch',
      fr: 'page Wikipédia en turc',
      it: 'pagina Wikipedia in turco.',
      tr: 'Türkçe Wikipeda sayfası.'
    },
    essential: true,
    type: 'url',
    descriptions: {
      en: 'URL of the fountain Wikipedia page in Italian.',
      de: 'URL der Brunnen-Wikipedia-Seite auf Italienisch.',
      fr: 'URL de la page de la fontaine Wikipedia en italien.',
      it: 'URL della pagina wikipedia in italiano.',
      tr: 'Türkçe wikipedia sayfasının URLi.'
    },
    src_pref: ['wikidata', 'osm'],
    src_config: {
      wikidata: {
        help: 'https://www.wikidata.org/wiki/Help:Sitelinks',
        src_path: ['sitelinks', 'itwiki'],
        src_instructions: {
          en: ['Wikipedia', 'it'],
          de: ['Wikipedia', 'it'],
          fr: ['Wikipédia', 'it'],
          it: ['Wikipedia', 'it'],
          tr: ['Wikipedia', 'it']
        },
        value_translation: name => {
          return `https://it.wikipedia.org/wiki/${name}`;
        }
      },
      osm: {
        src_path: ['properties', 'wikipedia'],
        src_instructions: {
          en: ['tag', 'wikipedia'],
          de: ['Attribut', 'wikipedia'],
          fr: ['Attribut', 'wikipedia'],
          it: ['Attributo', 'wikipedia'],
          tr: ['Özellik', 'wikipedia']
        },
        src_info: {
          en: 'The name of the wikipedia page must be prefixed with the language locale code. Example: "it:Jet d\'eau de Genève"',
          de: 'Der Name der Wikipedia-Seite muss mit dem Sprachumgebungscode vorangestellt werden. Beispiel: " it:Jet d\'eau de Genève"',
          fr: 'Le nom de la page wikipedia doit être préfixé avec le code de la langue locale. Exemple : "it:Jet d\'eau de Genève"',
          it: 'Il nome della pagina Wikipedia deve essere prefissato con il nome del linguaggio locale. Esempio: "it:Jet d\'eau de Genève"',
          tr: 'Wikipedia sayfasının ismi yerel dil koduyla oluşturulmalıdır. Örneğin: "tr:Bergama suyunun jeti" '
        },
        extraction_info: {
          en: 'Only values with language locale code "it" are retained and turned into a URL.',
          de: 'Nur Werte mit dem Sprachumgebungscode "it" werden beibehalten und in eine URL umgewandelt.',
          fr: 'Seules les valeurs avec le code local de langue "it" sont conservées et transformées en URL.',
          it: 'Solo i valori con codice del linguaggio locale "it" saranno conservati e trasformati in URL.',
          tr: 'Yalnizca yerel dil kodlu "it" değerleri tutulur ve bir URL\'e çevrilir.'
        },
        value_translation: val => {
          let parts = val.split(':');
          if (parts[0] === 'tr') {
            return `https://tr.wikipedia.org/wiki/${parts[1]}`;
          } else {
            return null;
          }
        }
      }
    }
  },
  operator_name: {
    name: {
      en: 'operator name',
      de: 'Betreiber-Name',
      fr: 'nom de l\'opérateur',
      it: 'nome dell\'operatore',
    tr: 'operatörün ismi '
    },
    essential: false,
    type: 'string',
    descriptions: {
      en: 'Name of the operator of the fountain.',
      de: 'Name des Brunnenbetreibers.',
      fr: 'Nom de l\'opérateur de la fontaine.',
      it: 'Nome dell\'operatore della fontana.',
      tr: 'Çeşmeyi çalıştıran operatirün adı. '
    },
    src_pref: ['wikidata', 'osm'],
    src_config: {
      wikidata: {
        src_path: ['claims', 'P137'],
        src_instructions: {
          en: ['Statement', 'operator'],
          de: ['Aussage', 'Betreiber'],
          fr: ['Déclaration', 'opérateur'],
          it: ['Dichiarazione', 'operatore'],
          tr: ['Tanım', 'operatör']
        },
        extraction_info: {
          en: 'Only the First value returned by Wikidata is kept.',
          de: 'Nur der von Wikidata zurückgegebene Wert First wird beibehalten.',
          fr: 'Seule la première valeur retournée par Wikidata est conservée.',
          it: 'Solo il primo valore ritornato da Wikidata sarà conservato.',
          tr: 'Yalnızca Wikipedia tarafından döndürülen Wikipedia sayfası tutulur.'
        },
        value_translation: vals => {return vals[0].value}
      },
      osm: {
        src_path: ['properties', 'operator'],
        src_instructions: {
          en: ['tag', 'operator'],
          de: ['Attribut', 'operator'],
          fr: ['Attribut', 'operator'],
          it: ['Attributo', 'operator'],
          tr: ['Özellik', 'operator']
        },
        extraction_info: {
          en: 'Known OpenStreetMap values are translated into "official names".',
          de: 'Bekannte OpenStreetMap-Werte werden in "offizielle Namen" übersetzt.',
          fr: 'Les valeurs connues d\'OpenStreetMap sont traduites en "noms officiels".',
          it: 'I valori conosciuti da OpenStreetMap sono tradotti in "nomi ufficiali".',
          tr: 'Bilinen OpenStreetMap değerleri "resmi isimlere\' çevrilir.'
        },
        value_translation: value => {
          switch (value) {
            case 'WVZ':
              return 'Wasserversorgung Zürich';
          }
        }
      }
    }
  },
  access_pet: {
    name: {
      en: 'pet bowl',
      de: 'Hundetrog',
      fr: 'bol pour chiens',
      it: 'ciotola per cani',
      tr: 'evcil hayvan su kasesi'
    },
    essential: true,
    type: 'boolean_string',
    descriptions: {
      en: 'Indicates whether the fountain has a small bowl for dogs.',
      de: 'Gibt an, ob der Brunnen einen Hundetrog hat.',
      fr: 'Indique si la fontaine a un bol pour chiens.',
      it: 'Indica se la fontana ha una piccola ciotola per cani.',
      tr: 'Bu çeşmede köpekler için küçük bir su kasesi olduğunu gösterir.'
    },
    src_pref: ['osm'],
    src_config: {
      osm: {
        src_path: ['properties', 'dog'],
        src_instructions: {
          en: ['tag', 'dog'],
          de: ['Attribut', 'dog'],
          fr: ['Attribut', 'dog'],
          it: ['Attributo', 'dog'],
          tr: ['Özellik', 'dog']
        },
        value_translation: identity
      },
      wikidata: null
    }
  },
  access_bottle: {
    name: {
      en: 'bottle refill',
      de: 'Flaschenfüllung',
      fr: 'remplissage de bouteille',
      it: 'riempimento di bottiglie',
      tr: 'şu şişesi doldurulabilir'
    },
    essential: true,
    type: 'boolean_string',
    descriptions: {
      en: 'Indicates whether a bottle can be refilled easily at the fountain.',
      de: 'Gibt an, ob eine Flasche am Brunnen leicht nachfüllbar ist.',
      fr: 'Indique si une bouteille peut être rechargée facilement à la fontaine.',
      it: 'Indica se una bottiglia può essere facilmente riempita alla fontana',
      tr: 'Bu su şişesinin doldurulabilineceğini gösterir'
    },
    src_pref: ['osm'],
    src_config: {
      osm: {
        src_info: {
          // tslint:disable-next-line:max-line-length
          en: 'If information is lacking, potability is inferred if the element has "man_made=water_tap" or "amenity=watering_place"  or "amenity=water_point" tags.',
          // tslint:disable-next-line:max-line-length
          de: 'Fehlende Informationen führen zur Trinkbarkeit, wenn das Element mit den Tags "man_made=water_tap" oder "amenity=watering_place" oder "amenity=water_point" versehen ist.',
          // tslint:disable-next-line:max-line-length
          fr: 'Si l\'information manque, la potabilité est déduite si l\'élément a des balises "man_made=water_tap" ou "amenity=watering_place" ou "amenity=water_point".',
          // tslint:disable-next-line:max-line-length
          it: 'Se l\'informazione è mancante, la potabilità viene inferita se l\'elemento ha i tag "man_made=water_tap" o "amenity=watering_place" o "amenity=water_point".',
          // tslint:disable-next-line:max-line-length
          tr: 'Eğer "man_made = water_tap" veya "amenity = watering_place" veya "amenity = water_point" ise çeşme suyu içilemez.'
        },
        src_path: ['properties', 'bottle'],
        src_instructions: {
          en: ['tag', 'bottle'],
          de: ['Attribut', 'bottle'],
          fr: ['Attribut', 'bottle'],
          it: ['Attributo', 'bottle'],
          tr: ['Özellik', 'bottle']
        },
        value_translation: identity
      },
      wikidata: null
    }
  },
  access_wheelchair: {
    name: {
      en: 'wheelchair accessible',
      de: 'Rollstuhlgerecht',
      fr: 'accès pour handicapés',
      it: 'accessibile per disabili',
      tr: 'tekerlekli sandalye ile ulaşılabilinir'
    },
    essential: true,
    type: 'boolean_string',
    descriptions: {
      en: 'Indicates whether fountain is wheelchair-friendly.',
      de: 'Gibt an, ob Brunnen rollstuhlgerecht ist.',
      fr: 'Indique si la fontaine est adaptée aux fauteuils roulants.',
      it: 'Indica se la fontana è accessibile da persone in sedia a rotelle.',
      tr: 'Bu çeşmenin tekerlekli sandalye ile ulaşılabilinir olduğunu gösterir.'
    },
    src_pref: ['osm'],
    src_config: {
      osm: {
        src_path: ['properties', 'wheelchair'],
        src_instructions: {
          en: ['tag', 'wheelchair'],
          de: ['Attribut', 'wheelchair'],
          fr: ['Attribut', 'wheelchair'],
          it: ['Attributo', 'wheelchair'],
          tr: ['Özellik', 'wheelchair']
        },
        value_translation: identity
      },
      wikidata: null
    }
  },
  potable: {
    name: {
      en: 'potable',
      de: 'trinkbar',
      fr: 'potable',
      it: 'potabile',
      tr: 'içilebilir'
    },
    essential: true,
    type: 'boolean_string',
    descriptions: {
      en: 'Indicates whether water is potable or not.',
      de: 'Gibt an, ob Wasser trinkbar ist oder nicht.',
      fr: 'Indique si l\'eau est potable ou non.',
      it: 'Indica se l\'acqua è potabile oppure no.',
      tr: 'Suyun içilebir olup olmadığını gösterir.'
    },
    src_pref: ['osm'],
    src_config: {
      osm: {
        src_info: {
          // tslint:disable-next-line:max-line-length
          en: 'If information is lacking, potability is inferred if the element has "man_made=drinking_fountain" or "amenity=drinking_water"  or "amenity=water_point" tags.',
          // tslint:disable-next-line:max-line-length
          de: 'Fehlende Informationen führen zur Trinkbarkeit, wenn das Element mit den Tags "man_made=drinking_fountain" oder "amenity=drinking_water" oder "amenity=water_point" versehen ist.',
          // tslint:disable-next-line:max-line-length
          fr: 'Si l\'information manque, la potabilité est déduite si l\'élément a des balises "man_made=drinking_fountain" ou "amenity=drinking_water" ou "amenity=water_point".',
          // tslint:disable-next-line:max-line-length
          it: 'Se l\'informazione è mancante, la potabilità viene inferita se l\'elemento ha i tag "man_made=drinking_fountain" o "amenity=drinking_water" o "amenity=water_point".',
          // tslint:disable-next-line:max-line-length
          tr: 'Eğer "man_made = drinking_fountain" veya "amenity = drinking_water" veya "amenity = water_point" ise çeşme suyu içilebilir.'
        },
        src_path: ['properties', 'drinking_water'],
        src_instructions: {
          en: ['tag', 'drinking_water'],
          de: ['Attribut', 'drinking_water'],
          fr: ['Attribut', 'drinking_water'],
          it: ['Attributo', 'drinking_water'],
          tr: ['Özellik', 'drinking_water']
        },
        value_translation: identity
      },
      wikidata: null
    }
  },
  potable_controlled: {
    name: {
      en: 'controlled',
      de: 'kontrollierte',
      fr: 'contrôlée',
      it: 'controllata',
      tr: 'denetli'
    },
    essential: true,
    type: 'boolean_string',
    descriptions: {
      en: 'Indicates whether the water is officially certified as potable.',
      de: 'Gibt an, ob die Wasserqualität von Behörden kontrolliert wird oder nicht.',
      fr: 'Indique si la qualité de l\'eau est contrôlée par les autorités ou non.',
      it: 'Indica se la qualità dell\'acqua è controllata dalle autorità o no.',
      tr: 'Bu suyun resmi olarak içelebilir olduğunu gösterir. '
    },
    src_pref: ['osm'],
    src_config: {
      osm: {
        src_path: ['properties', 'drinking_water:legal'],
        src_instructions: {
          en: ['tag', 'drinking_water:legal'],
          de: ['Attribut', 'drinking_water:legal'],
          fr: ['Attribut', 'drinking_water:legal'],
          it: ['Attributo', 'drinking_water:legal'],
          tr: ['Özellik', 'drinking_water:legal']
        },
        value_translation: identity
      },
      wikidata: null
    }
  },
  water_flow: {
    name: {
      en: 'water flow',
      de: 'Wasserfluss',
      fr: 'débit',
      it: 'flusso d\'acqua',
      tr: 'su akışı'
    },
    essential: false,
    type: 'string',
    descriptions: {
      en: 'Flow rate of fountain. [example: 1.5 l/min]',
      de: 'Wasserfluss des Brunnens. [Beispiel: 1.5 l/min]',
      fr: 'Débit d\'eau de la fontaine. [exemple: 1.5 l/min]',
      it: 'Flusso d\'acqua della fontana. [esempio: 1.5 l/min]',
      tr: 'Çeşme suyunun akış hızı. [örneşin: 1.5 l / dak]'
    },
    src_pref: ['osm'],
    src_config: {
      osm: {
        src_path: ['properties', 'flow_rate'],
        src_instructions: {
          en: ['tag', 'flow_rate'],
          de: ['Attribut', 'flow_rate'],
          fr: ['Attribut', 'flow_rate'],
          it: ['Attributo', 'flow_rate'],
          tr: ['Özellik', 'flow_rate']
        },
        value_translation: identity
      },
      wikidata: null
    }
  },
  // add property for #132
  swimming_place: {
    name: {
      en: 'swimming place',
      de: 'Badeanlage',
      fr: 'lieu de baignade',
      it: 'zona di balneazione',
      tr: 'yüzme yeri'
    },
    essential: true,
    type: 'boolean_string',
    descriptions: {
      en: 'Indicates whether it is possible to swim in the fountain.',
      de: 'Gibt an, ob es möglich ist im Brunnen sich zu baden.',
      fr: 'Indique s\'il est possible de se baigner dans la fontaine.',
      it: 'Indica se è possibile nuotare o bagnarsi nella piscina.',
      tr: 'Bu çeşme içinde yüzülebileceğini gösterir.'
    },
    src_pref: ['wikidata'],
    src_config: {
      osm: null,
      wikidata: {
        src_path: ['claims', 'P31'],
        src_instructions: {
          en: ['Statement', 'instance of'],
          de: ['Aussage', 'ist ein(e)'],
          fr: ['Déclaration', 'nature de l\'élément'],
          it: ['Dichiarazione', 'natura dell\'elemento'],
          tr: ['Tanım', 'elementin varlığı ']
        },
        src_info: {
          en: 'Fountain can be marked as an instance of "swimming pool" or "swimming place".',
          de: 'Der Brunnen kann als einen "Schwimmbecken" oder eine "Badeanlage" markiert werden.',
          fr: 'La fontaine peut être marquée comme étant une "piscine" ou un de "lieu de baignade".',
          it: 'La fontana può essere ritenuta come una "piscina" o "zona di balneazione".',
          tr: 'Bu çeşme "yüzme havuzu" veya "yüzülebilen yer" olarak tanımlanabilir.'
        },
        extraction_info: {
          en: 'Statement values are checked to see if any are "swimming pool" (Q1501) or "swimming place" (Q12004466)',
          // tslint:disable-next-line:max-line-length
          de: 'Die Aussagewerte werden überprüft, um festzustellen, ob es sich um "Schwimmbecken" (Q1501) oder "Badeanlage" (Q12004466) handelt.',
          // tslint:disable-next-line:max-line-length
          fr: 'Les valeurs des relevés sont vérifiées pour voir s\'il s\'agit de "piscine" (Q1501) ou de "lieu de baignade" (Q12004466).',
          // tslint:disable-next-line:max-line-length
          it: 'I valori della dichiarazione sono verificati per vedere se si tratta di "piscina" (Q1501) o di "luogo di balneazione" (Q12004466).',
          tr: 'Okunan değerler çeşmenin "havuz" (Q1501) veya "yüzme yeri" (Q12004466) olduğunu gösterir.'
        },
        value_translation: parents => {
          // loop through all instances to see if swimming pool or swimming place is among them
          for (let code of parents) {
            // return value only if qualifier matches the operator id
            if (['Q1501', 'Q12004466'].indexOf(code.value) >= 0 ) {
              return 'yes';
            }
          }
          return null;
        },
      }
    }
  },
  described_at_url: {
    name: {
      en: 'described at URL',
      de: 'wird Beschrieben in URL',
      fr: 'décrit à l\'URL',
      it: 'descritto all\'URL',
      tr: 'URL de tanımlanır'
    },
    essential: false,
    type: 'object',
    descriptions: {
      en: 'Fountain is described at the following URLs.',
      de: 'Der Brunnen wird in den angegebenen URLs beschrieben.',
      fr: 'La fontaine est décrits aux l\'URLs suivantes.',
      it: 'La fontana è descritta all\'URL seguente.',
      tr: 'Çeşme şu URLde tanımlanır.'
    },
    src_pref: ['wikidata'],
    src_config: {
      osm: null,
      wikidata: {
        src_path: ['claims', 'P973'],
        src_instructions: {
          en: ['Statement', 'described at URL'],
          de: ['Aussage', 'wird beschrieben in URL'],
          fr: ['Déclaration', 'décrit à l\'URL'],
          it: ['Dichiarazione', 'descritto all\'URL'],
          tr: ['Tanım', 'URL de tanımlanır ']
        },
        extraction_info: {
          en: 'All defined URLs are returned.',
          de: 'Alle definierten URLs werden zurückgegeben.',
          fr: 'Toutes les URL définies sont retournées.',
          it: 'Tutti gli URL definiti vengono ritornati.',
          tr: 'Tanımlanmış tüm URL değerleri verilir.'
        },
        value_translation: (urls) => {
          let validUrls = [];
          urls.forEach((elt) => {
            let url = elt.value;
            if (!_.startsWith(url, 'https://h2o.do')) {
              // as per https://github.com/water-fountains/import2wikidata/issues/10#issuecomment-528876473
              validUrls.push(url);
            }
          });
          if (validUrls.length > 0) {
            return validUrls;
          }
          return null;
        }
      }
    }
  },
  youtube_video_id: {
    name: {
      en: 'Youtube video IDs',
      de: 'YouTube-Video-Kennungen',
      fr: 'identifiants de vidéos YouTube',
      it: 'identificatori dei video YouTube',
      tr: 'YouTube video IDsi'
    },
    essential: false,
    type: 'object',
    descriptions: {
      en: 'YouTube video IDs of a video portraying the fountain',
      de: 'YouTube-Video-Kennungen',
      fr: 'identifiant vidéos YouTube',
      it: 'identificatore del video YouTube',
      tr: 'Çeşmeyi gösteren YouTube videosu'
    },
    src_pref: ['wikidata'],
    src_config: {
      osm: null,
      wikidata: {
        src_path: ['claims', 'P1651'],
        src_instructions: {
          en: ['Statement', 'YouTube video ID'],
          de: ['Aussage', 'YouTube-Video-Kennung'],
          fr: ['Déclaration', 'identifiant de la vidéo YouTube'],
          it: ['Dichiarazione', 'identificatore del video YouTube'],
          tr: ['Tanım', 'YouTube Video ID']
        },
        extraction_info: {
          en: 'All defined IDs are returned.',
          de: 'Alle definierten IDs werden zurückgegeben.',
          fr: 'Tous les ID définis sont retournés.',
          it: 'Tutti gli ID definiti vengono ritornati.',
          tr: 'Tüm tanımlanmış IDler verilir.'
        },
        value_translation: (ids) => {
          return _.map(ids, 'value');
        }
      }
    }
  }
};

// assign default attributes to all the properties
_.forEach(fountain_properties, function (property, key) {
  property.id = key;  // the id is the same as the key
  property.value = null;  // the default value is "null"
  property.comments = '';
  // tslint:disable-next-line:max-line-length
  property.status = PROP_STATUS_WARNING;  // the property status is a warning if no data is available. This is updated when the data is fetched
  property.source = '';  // this indicates the source from which the property value was obtained.
});
// some custom values
fountain_properties.fixme['status'] = PROP_STATUS_OK;
fountain_properties.fixme['comments'] = '';
export const fountain_property_metadata = fountain_properties;

/**
 * Returns the value of a property for a given fountain and a given source
 * @param {Fountain object} fountain Fountain from which property value should be fetched
 * @param {String} source either 'osm' or 'wikidata', depending on which source should be used
 * @param {'String'} property codename of property for which value should be fetched
 */
export function get_prop(fountain, source, property) {
  return fountain_properties[property].src_config[source].value_translation(
    _.get(fountain, fountain_properties[property].src_config[source].src_path));
}
