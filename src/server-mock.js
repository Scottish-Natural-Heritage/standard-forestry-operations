import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
// Load the config.
import config from './config.js';
// Load the app.
import app from './app.js';

const mockAxios = new MockAdapter(axios);

/* Turn off spell checking for the place names. spell-checker:disable */
/* eslint-disable camelcase */
// prettier-ignore
mockAxios.onGet('http://mock-gazetteer-api/endpoint').reply((config) => {
  if (config.params.postcode && config.params.postcode === 'IV3 8NW') {
    return [
      200,
      {
        results: [
          {
            address: [
              {
                uprn: 130_053_286,
                summary_address: 'Gateside, 1A Leachkin Road, Inverness, IV3 8NW',
                matchscore: 100,
              },
              {
                uprn: 130_053_287,
                summary_address: 'Orcadia, 1B Leachkin Road, Inverness, IV3 8NW',
                matchscore: 100,
              },
              {
                uprn: 130_053_284,
                summary_address: '2 Leachkin Road, Inverness, IV3 8NW',
                matchscore: 100,
              },
              {
                uprn: 130_053_285,
                summary_address: '4 Leachkin Road, Inverness, IV3 8NW',
                matchscore: 100,
              },
              {
                uprn: 130_053_278,
                summary_address: 'Burnside, Leachkin Road, Inverness, IV3 8NW',
                matchscore: 100,
              },
              {
                uprn: 130_053_279,
                summary_address: 'Crisdon, Leachkin Road, Inverness, IV3 8NW',
                matchscore: 100,
              },
              {
                uprn: 10_091_962_936,
                summary_address:
                  'Crofting Commission, Crofting Commission, Great Glen House, Leachkin Road, Inverness, IV3 8NW',
                matchscore: 100,
              },
              {
                uprn: 10_092_032_547,
                summary_address: 'Naturescot, Naturescot, Great Glen House, Leachkin Road, Inverness, IV3 8NW',
                matchscore: 100,
              },
              {
                uprn: 10_092_024_846,
                summary_address:
                  'Care Inspectorate, Care Inspectorate, Great Glen House, Leachkin Road, Inverness, IV3 8NW',
                matchscore: 100,
              },
              {
                uprn: 10_091_801_055,
                summary_address:
                  'Bord Na Gaidhlig, Bord Na Gaidhlig, Great Glen House, Leachkin Road, Inverness, IV3 8NW',
                matchscore: 100,
              },
              {
                uprn: 10_091_801_051,
                summary_address:
                  'Moray Firth Partnership, Moray Firth Partnership, Great Glen House, Leachkin Road, Inverness, IV3 8NW',
                matchscore: 100,
              },
              {
                uprn: 130_137_528,
                summary_address: 'Visitscotland, Great Glen House, Leachkin Road, Inverness, IV3 8NW',
                matchscore: 100,
              },
              {
                uprn: 10_091_801_052,
                summary_address:
                  'Deer Commission For Scotland, Deer Commission For Scotland, Great Glen House, Leachkin Road, Inverness, IV3 8NW',
                matchscore: 100,
              },
              {
                uprn: 130_053_280,
                summary_address: 'Hillside House, Leachkin Road, Inverness, IV3 8NW',
                matchscore: 100,
              },
              {
                uprn: 130_143_180,
                summary_address: 'Old Post Office, Leachkin Road, Inverness, IV3 8NW',
                matchscore: 100,
              },
              {
                uprn: 130_053_283,
                summary_address: 'The Old School, Leachkin Road, Inverness, IV3 8NW',
                matchscore: 100,
              },
              {
                uprn: 130_053_281,
                summary_address: 'The Brackens, Leachkin Road, Inverness, IV3 8NW',
                matchscore: 100,
              },
              {
                uprn: 130_053_277,
                summary_address: 'Tigh Na Bruaich, Leachkin Road, Inverness, IV3 8NW',
                matchscore: 100,
              },
            ],
          },
        ],
        metadata: {
          querytime: 0.018_79,
          vintage: 87,
          jobid: null,
          count: 18,
          maxResults: 1000,
          status: 'OK',
        },
      },
    ];
  }

  // prettier-ignore
  if (config.params.postcode && config.params.postcode === 'XM4 5HQ') {
    return [
      200,
      {
        results: ['No records found.'],
        metadata: {
          querytime: 0.016_75,
          vintage: 87,
          jobid: null,
          count: 0,
          maxResults: 1000,
          status: 'OK',
        },
      },
    ];
  }

  // prettier-ignore
  if (config.params.postcode && config.params.postcode === 'PH1 3EW') {
    return [
      200,
      {
        results: [
          {
            address: [
              {
                uprn: 124_062_288,
                summary_address:
                  'Scottish Natural Heritage, Battleby House, B8063 From The Entrance To Coldrochie Farm To The A9t Slip Road West Of Luncarty, Redgorton, PH1 3EW',
                matchscore: 100,
              },
            ],
          },
        ],
        metadata: {
          querytime: 0.017_08,
          vintage: 87,
          jobid: null,
          count: 1,
          maxResults: 1000,
          status: 'OK',
        },
      },
    ];
  }

  // prettier-ignore
  if (
      (config.params.uprn && config.params.uprn === 10_092_032_547)) {
      return [
        200,
        {
          results: [
            {
              address: [
                {
                  uprn: 10_092_032_547,
                  udprn: '18843498',
                  change_type: 'I',
                  state: 2,
                  state_date: '2008-12-01',
                  class: 'CO01',
                  parent_uprn: null,
                  rpc: 2,
                  local_custodian_code: 9074,
                  country: 'S',
                  la_start_date: '2012-04-27',
                  last_update_date: '2018-12-09',
                  entry_date: '2005-03-15',
                  rm_organisation_name: 'SCOTTISH NATURAL HERITAGE',
                  la_organisation: '',
                  department_name: '',
                  legal_name: '',
                  sub_building_name: 'GREAT GLEN',
                  building_name: 'GREAT GLEN HOUSE',
                  building_number: '1',
                  sao_start_number: null,
                  sao_start_suffix: '',
                  sao_end_number: null,
                  sao_end_suffix: ' ',
                  sao_text: '',
                  alt_language_sao_text: '',
                  pao_start_number: null,
                  pao_start_suffix: '',
                  pao_end_number: null,
                  pao_end_suffix: '',
                  pao_text: 'GREAT GLEN HOUSE',
                  alt_language_pao_text: '',
                  usrn: 30_007_486,
                  usrn_match_indicator: '1',
                  area_name: '',
                  level: '',
                  official_flag: 'N',
                  os_address_toid: 'osgb1000002232013577',
                  os_address_toid_version: 15,
                  os_roadlink_toid: 'osgb4000000004477625',
                  os_roadlink_toid_version: 11,
                  os_topo_toid: 'osgb1000039357490',
                  os_topo_toid_version: 6,
                  voa_ct_record: null,
                  voa_ndr_record: null,
                  street_description:
                    'LEFT AFTER LEAVING LEACHKIN ROAD',
                  alt_language_street_description: '',
                  dependent_thoroughfare: '',
                  thoroughfare: '',
                  welsh_dependent_thoroughfare: '',
                  welsh_thoroughfare: '',
                  double_dependent_locality: '',
                  dependent_locality: 'INVERNESS',
                  locality: '',
                  welsh_dependent_locality: '',
                  welsh_double_dependent_locality: '',
                  town_name: 'INVERNESS',
                  administrative_area: 'HIGHLANDS AND IDLANDS',
                  post_town: 'INVERNESS',
                  welsh_post_town: '',
                  postcode: 'IV3 8NW',
                  postcode_locator: 'IV3 8NW',
                  postcode_type: 'L',
                  delivery_point_suffix: '1A',
                  addressbase_postal: 'D',
                  po_box_number: '',
                  ward_code: 'S13003067',
                  parish_code: '',
                  rm_start_date: '2012-03-19',
                  multi_occ_count: 1,
                  voa_ndr_p_desc_code: '',
                  voa_ndr_scat_code: '',
                  alt_language: ' ',
                  matchscore: 100,
                },
              ],
            },
          ],
          metadata: {
            querytime: 0.017_94,
            vintage: 89,
            jobid: null,
            count: 1,
            maxResults: 1000,
            status: 'OK',
          },
        },
      ];
    }

  return [500];
});

/* Turn spell checking back on now. spell-checker:enable */
/* eslint-enable camelcase */
// Start the micro-app and log any errors.
app.listen(config.port, () => {
  console.log(`Server listening on http://localhost:${config.port}${config.pathPrefix}.`);
});
