import type { MorphologyHelp } from "./morphology_help";

export const morph_help : MorphologyHelp[] = [
  {
    title: 'Winging',
    desc: 'The axial rotation of one or both of the central maxillary incisors is known as winging.  No plaque.',
    valid_codes: [1, 2, 3, 4, 5, 9],
    codes_desc: [
      '1. Bilateral winging: Central incisors are rotated mesiolingually, giving a V-shaped appearance when viewed from the occlusal surface. The angle formed is less than 20 degrees.',
      '2. The angle formed is greater than 20 degrees.',
      '3. Unilateral winging: Only one of the incisors is rotated. The other is straight.  Score the straight tooth as "4".',
      '4. Straight: One or both teeth form a straight labial surface, or follow the curvature of the dental arcade.',
      '5. Counter-winging: One or both teeth are rotated distolingually.  This is not scored as present if it is due to tooth crowding.  Score the straight tooth as "4".',
      '9. Unobservable.',
    ]
  },
  {
    title: 'Shoveling',
    desc: 'The presence of lingual marginal ridges or elevated enamel ridges that give teeth a shovel appearance.  Use plaque 1 for maxillary central incisors.  Use plaque 2 for maxillary lateral incisors and canines.  Use plaque 14 for mandibular incisors and plaque 2 for mandibular canines.',
    valid_codes: [0, 1, 2, 3, 4, 5, 6, 7, 9],
    codes_desc: [
      '0. None. Lingual surface is essentially flat.',
      '1. Faint.  Very slight elevations of mesial and distal aspects of lingual surface can be seen and palpated.',
      '2. Trace: Elevations are easily seen.  This grade is probably considered minimal expression by most observers.',
      '3. Semishovel: Stronger ridging is present and there is a tendency for ridge convergence at the cingulum.',
      '4. Semishovel: Convergence and ridging are stronger than in grade 3.',
      '5. Shovel: Strong development of ridges, which almost contact at the cingulum.',
      '6. Marked shovel: Strongest development. Mesial and distal lingual ridges are sometimes in contact at the cingulum.',
      '7. (Maxillary lateral incisors only) Barrel: Expression exceeds grade 6.  Mesial and distal ridges meet to form a barrel-shaped tooth. The form should not result from a hypertrophied tuberculum dentale.',
      '9. Unobservable.',
    ]
  },
  {
    title: 'Double-Shoveling',
    desc: 'This trait can be scored when labial marginal ridges are present and range from palpable to very pronounced ridging.  Use plaque 3.',
    valid_codes: [0, 1, 2, 3, 4, 5, 6, 9],
    codes_desc: [
      '0. None: Labial surface is smooth.',
      '1. Faint: Mesial and distal ridging can be seen in strong contrasting light.  Distal ridge may be absent in this and stronger grades.',
      '2. Trace: Ridging is more easily seen and palpated.',
      '3. Semi-double-shovel: Ridging can be readily palpated.',
      '4. Double-shovel: Ridging is pronounced on at least one-half of the total crown height.',
      '5. Pronounced double-shovel: Ridging is very prominent and may occur from the occlusal surface to the crown-root junction.',
      '6. Extreme double-shovel.',
      '9. Unobservable.',
    ]
  },
  {
    title: 'Labial Convexity',
    desc: 'The labial surface of the upper incisors can range from flat to exhibiting a marked degree of curvature.  Observe the medial aspect of the labial surface, at 2/3 of the distance from the CEJ.  Use plaque 4.',
    valid_codes: [0, 1, 2, 3, 4, 9],
    codes_desc: [
      '0. Labial surface is flat.',
      '1. Labial surface exhibits trace convexity.',
      '2. Labial surface exhibits weak convexity.',
      '3. Labial surface exhibits moderate convexity.',
      '4. Labial surface exhibits pronounced convexity.',
      '9. Unobservable.',
    ]
  },
  {
    title: 'Interruption Groove',
    desc: 'These are grooves that cross the cingulum and may continue down the root. They are seen more frequently on the lateral incisor.  No plaque.',
    valid_codes: [0, 1, 2, 3, 4, 9],
    codes_desc: [
      '0. None: The mesial, distal, and medial areas of the lingual surface of the incisor are smooth, continuous, and not disrupted by any vertical to near-horizontal groove.',
      '1. An interruption groove occurs on the mesiolingual border.',
      '2. An interruption groove occurs on the distolingual border.',
      '3. Grooves occur on both the mesio- and distolingual borders.',
      '4. A groove occurs in the medial area of the cingulum.',
      '9. Unobservable.',
    ]
  },
  {
    title: 'Tuberculum Dentale',
    desc: 'This can be found in the cingular region of the lingual surface.  May take the form of ridges or various degrees of cusp expression.  Use plaque 5 for grades 0-4; use plaque 7 for grades 5-7.',
    valid_codes: [0, 1, 2, 3, 4, 5, 6, 7, 9],
    codes_desc: [
      '0. No expression: Cingular region of the lingual surface is smooth.  Ignore any shoveling presence.',
      '1. Faint ridging.',
      '2. Trace ridging.',
      '3. Strong ridging.',
      '4. Pronounced ridging.',
      '5. A weakly developed cuspule is attached to either the mesio- or distolingual marginal ridge.  Cuspule apex is not free.  Not shown in plaque 6.  Interpolate between grade 4 in plaque 5 and the tuberculum dentale found in grade 4 of plaque 7.',
      '6. Weakly developed cuspule with a free apex.  Size corresponds approximately with the tuberculum dentale found in grade 4 of plaque 7.',
      '7. Strong cusp with a free apex.  Size is equal to or greater than the tuberculum dentale found in grade 5 of plaque 7.',
      '9. Unobservable.',
    ]
  },
  {
    title: 'Canine Mesial Ridge',
    desc: 'Commonly, the mesiolingual marginal ridge is similar in size to the distolingual marginal ridge.  This feature is present when the mesial ridge is larger than the distal.  Use plaque 6.',
    valid_codes: [0, 1, 2, 3, 9],
    codes_desc: [
      '0. Mesial and distal lingual ridges are the same size.  Neither is attached to the tuberculum dentale if present.',
      '1. Mesiolingual ridge is larger than the distolingual, and is weakly attached to the tuberculum dentale.',
      '2. Mesiolingual ridge is larger than the distolingual, and is moderately attached to the tuberculum dentale.',
      "3. Morris's type form.  Mesiolingual ridge is much larger than the distolingual, and is fully incorporated into the tuberculum dentale.",
      '9. Unobservable.',
    ]
  },
  {
    title: 'Canine Distal Acc Ridge',
    desc: 'This ridge can be observed in the distolingual fossa between the median ridge and the distolingual marginal ridge.  Score only on unworn teeth.  Use plaque 7 on maxillary teeth and plaque 15 on mandibular teeth.',
    valid_codes: [0, 1, 2, 3, 4, 5, 9],
    codes_desc: [
      '0. Distal accessory ridge is absent.',
      '1. Distal accessory ridge is very faint.  (No examples of grade 1 appears in plaque 7, interpolation is required).',
      '2. Distal accessory ridge is weakly developed.',
      '3. Distal accessory ridge is moderately developed.',
      '4. Distal accessory ridge is strongly developed.',
      '5. Distal accessory ridge is very pronounced.',
      '9. Unobservable.',
    ]
  },
  {
    title: 'PreM Mes and Dist Acc Cusps',
    desc: 'Occasionally, small accessory cusps can be found at the mesial and/or distal ends of the sagittal grooves.  These cusps, however, must be completely separated from both the buccal and lingual cusps to be considered an accessory cusp.  Score only on relatively unworn teeth.  No plaque.',
    valid_codes: [0, 1, 9],
    codes_desc: [
      '0. No accessory cusps occur.',
      '1. Mesial and/or distal accessory cusps are present.',
      '9. Unobservable.',
    ]
  },
  {
    title: 'Tricuspid Premolars',
    desc: 'The upper premolars are often termed "bicuspid", meaning "two cusps." They generally have two well-defined cusps of equal size, one being a buccal cusp and the other a lingual cusp. Hence, premolars with three cusps are quite rare.  An additional cusp would be lingual.  No plaque.',
    valid_codes: [0, 1, 9],
    codes_desc: [
      '0. Extra distal cusp (hypocone) is absent.',
      '1. Hypocone is present.  Its size equals that of the normal lingual cusp.',
      '9. Unobservable.',
    ]
  },
  {
    title: 'Distosaggital Ridge',
    desc: 'This trait is present when a well-defined ridge extends from the apex of the buccal cusp to the distal occlusal border at the sagittal sulcus.  Use plaque 8.',
    valid_codes: [0, 1, 9],
    codes_desc: [
      '0. Normal premolar form occurs.',
      '1. Distosagittal ridge is present.',
      '9. Unobservable',
    ]
  },
  {
    title: 'Metacone',
    desc: 'The metacone is known as cusp 3 or the distobuccal cusp.  It is usually present.  Use plaque 9.',
    valid_codes: [0, 1, 2, 3, 3, 4, 5, 9],
    codes_desc: [
      '0. Metacone is absent.',
      '1. An attached ridge is present at the metacone site, but there is no free apex.',
      '2. A faint cuspule with a free apex is present.',
      '3. Weak cusp is present.',
      '3.5 An intermediate-sized cusp is present (not shown on plaque, interpolation necessary).',
      '4. Metacone is large.',
      '5. Metacone is very large (equal in size to a large M1 hypocone).',
      '9. Unobservable.',
    ]
  },
  {
    title: 'Hypocone',
    desc: 'The hypocone is the distolingual cusp or cusp 4.  Due to the presence of many distal accessory cuspules on the third molar, judgement must be used when scoring the presence of hypocone.  Use plaque 10.',
    valid_codes: [0, 1, 2, 3, 3, 4, 5, 9],
    codes_desc: [
      '0. No hypocone.  Site is smooth.',
      '1. Faint ridging present at the site.',
      '2. Faint cuspule present.',
      '3. Small cusp present.',
      '3.5 Moderate-sized cusp present.',
      '4. Large cusp present.',
      '5. Very large cusp present.',
      '9. Unobservable.',
    ]
  },
  {
    title: 'Metaconule',
    desc: 'Known as cusp 5, the metaconule is present on the distal aspect, between the metacone and hypocone.  Use plaque 11.',
    valid_codes: [0, 1, 2, 3, 4, 5, 9],
    codes_desc: [
      '0. Site of cusp 5 is smooth, there being only a single distal groove present separating cusps 3 and 4.',
      '1. Faint cuspule is present.',
      '2. Trace cuspule is present.',
      '3. Small cuspule is present.',
      '4. Small cusp is present.',
      '5. Medium-sized cusp is present.',
      '9. Unobservable',
    ]
  },
  {
    title: "Carabelli's Trait",
    desc: 'This trait, which ranges from a groove to a large cusp with a free apex, is located on the lingual surface of the mesiolingual cusp.  Use plaque 10.',
    valid_codes: [0, 1, 2, 3, 4, 5, 6, 7, 9],
    codes_desc: [
      '0. The mesiolingual aspect of cusp 1 is smooth.',
      '1. A groove is present.',
      '2. A pit is present.',
      '3. A small Y-shaped depression is present.',
      '4. A large Y-shaped depression is present.',
      '5. A small cusp without a free apex occurs.  The distal border of the cusp does not contact the lingual groove separating cusps 1 and 4.',
      '6. A medium-sized cusp with an attached apex making contact with the medial lingual groove is present.',
      '7. A large free cusp is present.',
      '9. Unobservable.',
    ]
  },
  {
    title: 'Parastyle',
    desc: 'Ranging from a pit to a large cusp with a free apex, this trait is most frequently found on the buccal surface of the mesiobuccal cusp of M3.  Though this trait is quite rare, a parastyle may occur on the other molars in the same location.  Use plaque 13.',
    valid_codes: [0, 1, 2, 3, 4, 5, 6, 9],
    codes_desc: [
      '0. The buccal surfaces of cusps 2 and 3 are smooth.',
      '1. A pit is present in or near the buccal groove between cusps 2 and 3.',
      '2. A small cusp with an attached apex is present.',
      '3. A medium-sized cusp with a free apex is present.',
      '4. A large cusp with a free apex is present.',
      '5. A very large cusp with a free apex is present.  This form usually involves the buccal surface of both cusps 2 and 3.',
      '6. An effectively free peg-shaped crown attached to the root of the third molar is present.  This condition is extremely rare, and is not shown in the plaque.',
      '9. Unobservable.',
    ]
  },
  {
    title: 'Enamel Extensions',
    desc: 'This trait can be seen as projections of the enamel border in an apical direction.  An enamel pearl may be present at or near the extension site, even without the presence of an extension.  No plaque.',
    valid_codes: [0, 1, 2, 3, 9],
    codes_desc: [
      '0. Enamel border is straight, or rarely curved towards the crown.  Score any extension not attached to the crown as absent.',
      '1. A faint, approximately 1.0-mm-long extension projecting toward and along the root.',
      '2. A medium-sized, approximately 2.0-mm-long extension.',
      '3. A lengthy extension, generally >4.0 mm in length is present.  It may extend all the way to the root bifurcation on molars.',
      '9. Unobservable.',
    ]
  },
  {
    title: 'Maxillary Root Number',
    desc: 'Upper premolars usually have a single root.  When multiple roots are present, it will most likely occur on the first premolar.  Three roots are standard for the upper first molar, with the second molar usually displaying the greatest variation in root number.  The third molar will usually have one or two roots.  The mandibular canine may have either one or two roots.  When a second root is present, it is small and is seen on the lingual aspect.  The lower molars can have one to three roots.  No plaque.',
    valid_codes: [1, 2, 3, 4, 9],
    codes_desc: [
      '1. One root: Tip may be bifurcated. In the case of molars, the bifid tip may have deeply inset developmental grooves.',
      '2. Two roots: Separate roots must be greater than one-quarter to one-third of the total root length.  Length determination should take into account bending which is common on third molars.',
      '3. Three roots: Length defined as in grade 2.',
      '4. Four roots: (only in molars), length defined as in grade 2.',
      '9. Unobservable.',
    ]
  },
  {
    title: 'Mandibular Root Number',
    desc: 'Upper premolars usually have a single root.  When multiple roots are present, it will most likely occur on the first premolar.  Three roots are standard for the upper first molar, with the second molar usually displaying the greatest variation in root number.  The third molar will usually have one or two roots.  The mandibular canine may have either one or two roots.  When a second root is present, it is small and is seen on the lingual aspect.  The lower molars can have one to three roots.  No plaque.',
    valid_codes: [1, 2, 3, 4, 9],
    codes_desc: [
      '1. One root: Tip may be bifurcated. In the case of molars, the bifid tip may have deeply inset developmental grooves.',
      '2. Two roots: Separate roots must be greater than one-quarter to one-third of the total root length.  Length determination should take into account bending which is common on third molars.',
      '3. Three roots: Length defined as in grade 2.',
      '4. Four roots: (only in molars), length defined as in grade 2.',
      '9. Unobservable.',
    ]
  },
  {
    title: 'Radical Number',
    desc: 'Developmental grooves partition roots into two or more "unseparated" divisions.  These sections of partitioned roots are known as radicals.  Do not score teeth exhibiting hypercementosis.  No plaque.',
    valid_codes: [1, 2, 3, 4, 5, 6, 7, 8],
    codes_desc: [
      '1. One radical: No developmental grooves.',
      '2. Two radicals: Two developmental grooves or two round roots with no developmental grooves.',
      '3. Three radicals:  Three developmental grooves or one round root with no developmental grooves and one root with two developmental grooves.',
      '4. Four radicals: Continuation of above with various root number and developmental groove combinations.',
      '5. Five radicals: Continuation of above.',
      '6. Six radicals: Continuation of above.',
      '7. Seven radicals: Continuation of above.',
      '8. Eight radicals: Continuation of above.',
    ]
  },
  {
    title: 'Peg-Shaped Teeth',
    desc: 'This trait is defined as a tooth which is very reduced in size and one that lacks the normal crown morphology. If a peg-shaped upper third molar has been lost postmortem, it can often be identified from the socket size and circular form.  No plaque.',
    valid_codes: [0, 1, 2, 9],
    codes_desc: [
      '0. Normal-sized tooth with normal crown morphology.',
      '1. Tooth reduced in size, but having normal crown form.  In the case of molars, the crown is reduced in size to 7- to 10-mm buccolingual diameter.  Form is near normal or somewhat "shriveled".',
      '2. Peg-shaped tooth: reduced in size and lacking normal crown morphology. Molar is < 7 mm in buccolingual diameter.  Crown is peg or cone-shaped with rarely more than two rounded cusps lacking any secondary morphology.  Root is simple and single.',
      '9. Unobservable.',
    ]
  },
  {
    title: 'Odontome',
    desc: 'These are cone-shaped enamel and dentin projections which occur almost anywhere along the medial line of the buccal cusp of the premolar.  Odontomes are usually quite rare.  Do not score if marked wear is present on the buccal cusp.  No plaque.',
    valid_codes: [0, 1, 9],
    codes_desc: [
      '0. Odontome not present.',
      '1. Odontome present.',
      '9. Unobservable.',
    ]
  },
  {
    title: 'Premolar Ling Cusp Variation',
    desc: 'The buccal cusp is almost always larger and more complex morphologically than the lingual cusp.  Use plaque 16 for maxillary teeth and plaque 17 for mandibular.',
    valid_codes: [0, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    codes_desc: [
      '0. No lingual cusp: A ridge may be present that suggests a much reduced structure without a free tip, but it is scored as cusp absent.  Grade 0 was added after plaque production began when it was realized that lingual cusps can be absent (was formely scored as "A").',
      '1. One lingual cusp: Size and form may vary a great deal but tip can be seen.',
      '1.5 One or two lingual cusps: This indecisive class should not be used for worn teeth.  It is better to score such teeth as missing data.',
      '2. Two lingual cusps: Mesial cusp is larger than distal cusp.',
      '3. Two lingual cusps: Mesial cusp is much larger than distal cusp.',
      '4. Two lingual cusps: Mesial and distal cusps are equal size.',
      '5. Two lingual cusps: Distal cusp is larger than mesial cusp.',
      '6. Two lingual cusps: Distal cusp is much larger than mesial cusp.',
      '7. Two lingual cusps: Distal cusp is very much larger than mesial cusp.  With wear, this class can be confused with grade 0.  When in doubt, score individual as missing data.',
      '8. Three lingual cusps: Each is about the same size.',
      '9. Unobservable.',
      '10. Three lingual cusps: Mesial cusp is much larger than medial and/or distal cusp.  With wear, grade 10 can be confused with grade 3.  When in doubt, score individual as missing data.  This grade is scored as grade 9 on the plaques.',
      '11. Three lingual cusps: Medial cusp is larger than mesial and/or distal cusp.',
    ]
  },
  {
    title: 'Anterior Fovea',
    desc: 'This groove takes the form of a triangular depression distal to the mesial marginal ridge.  Score only on unworn teeth.  Use plaque 18.',
    valid_codes: [0, 1, 2, 3, 4, 9],
    codes_desc: [
      '0. Anterior fovea is absent. The sulcus between cusps 1 and 2 continues without interruption from the center of the occlusal surface to the mesial border.',
      '1. A weak ridge connects the mesial aspects of cusps 1 and 2, producing a faint groove.',
      '2. The connecting ridge is larger and the resulting groove deeper than in grade 1.',
      '3. Groove is longer than in grade 2.',
      '4. Groove is very long and mesial ridge is robust.',
      '9. Unobservable.',
    ]
  },
  {
    title: 'Groove Pattern',
    desc: 'Many variations in groove pattern can be seen, however, the three main patterns are listed here and should be scored regardless of the number of cusps.  No plaque.',
    valid_codes: [1, 2, 3, 4, 9],
    codes_desc: [
      '1. Y pattern-Cusps 2 and 3 are in broad contact.',
      '2. + pattern-Cusps 1-4 are in contact.',
      '3. X pattern-Cusps 1 and 4 are in broad contact.',
      '4. Wrinkled enamel without defined groove pattern.',
      '9. Unobservable.',
    ]
  },
  {
    title: 'Cusp Number',
    desc: 'Cusps should be scored regardless of size. The tooth should be scored as having more than 4 cusps if cusp 5 is present but the presence of cusp 6 is uncertain.  Cusp 7 is never included when determining the number of cusps present.  It should be noted that the sequence of numbering cusps in the mandible is different from that in the maxilla.',
    valid_codes: [4, 5, 6, 9],
    codes_desc: [
      '4. Cusps 1 to 4 (protoconid, metaconid, hypoconid, entoconid) are present.',
      '5. Cusp 5 (hypoconulid) is also present.',
      '6. Cusp 6 (entoconulid) is also present.',
      '9. Unobservable.',
    ]
  },
  {
    title: 'Deflecting Wrinkle',
    desc: 'This trait, in its most extreme form, consists of an L-shaped ridge on the medial side of cusp 2.  Score only on unworn teeth.  Use plaque 19.',
    valid_codes: [0, 1, 2, 3, 9],
    codes_desc: [
      '0. Deflecting wrinkle is absent.  Medial ridge of cusp 2 is straight.',
      '1. Cusp 2 medial ridge is straight, but shows a midpoint constriction.',
      '2. Medial ridge is deflected distally, but does not make contact with cusp 4.',
      '3. Medial ridge is deflected distally forming an L-shaped ridge.  The medial ridge contacts cusp 4.',
      '9. Unobservable.',
    ]
  },
  {
    title: 'Distal Trigonid Crest',
    desc: 'This trait is rare in permanent molars.  If present, it can be seen as a ridge that bridges cusps 1 and 2.  Score only on unworn teeth.  No plaque.',
    valid_codes: [0, 1, 9],
    codes_desc: [
      '0. Absent: Distal borders of cusps 1 and 2 are not connected by a crest.',
      '1. Present: Distal borders are connected by a ridge.',
      '9. Unobservable.',
    ]
  },
  {
    title: 'Protostylid',
    desc: 'This trait varies from a groove to a well-developed cusp on the mesial-buccal surface of cusp 1.  It is more commonly found on the first and third molars.  Use plaque 20.',
    valid_codes: [0, 1, 2, 3, 4, 5, 6, 7, 9],
    codes_desc: [
      '0. No expression of any sort. Buccal surface is smooth, with the exception of the buccal groove.',
      '1. A pit occurs in the buccal groove.',
      '2. Buccal groove is curved distally.',
      '3. A faint secondary groove extends mesially from the buccal groove.',
      '4. Secondary groove is slightly more pronounced.',
      '5. Secondary groove is stronger and can be easily seen.',
      '6. Secondary groove extends across most of the buccal surface of cusp 1.  This is considered a weak or small cusp.',
      '7. A cusp with a free apex occurs.',
      '9. Unobservable.',
    ]
  },
  {
    title: 'Cusp 5 (Hypoconulid)',
    desc: 'Located on the distal occlusal aspect of the lower molars.  Use plaque 21.',
    valid_codes: [0, 1, 2, 3, 4, 5, 9],
    codes_desc: [
      '0. No occurrence of cusp 5.  The molar has only 4 cusps (1-4).',
      '1. Cusp 5 is present and very small.',
      '2. Cusp 5 is small.',
      '3. Cusp 5 is medium-sized.',
      '4. Cusp 5 is large.',
      '5. Cusp 5 is very large.',
      '9. Unobservable.',
    ]
  },
  {
    title: 'Cusp 6 (Entoconulid)',
    desc: 'The entoconulid develops in the distal fovea of the lower molars, lingual to cusp 5.  However, if there is only a single distal cusp, it cannot be determined whether it is cusp 5 or 6.  In order to define cusp 6, two distal cusps must be present.  Use plaque 22.',
    valid_codes: [0, 1, 2, 3, 4, 5],
    codes_desc: [
      '0. Cusp 6 is absent.',
      '1. Cusp 6 is much smaller than cusp 5.',
      '2. Cusp 6 is smaller than cusp 5.',
      '3. Cusp 6 is equal in size to cusp 5.',
      '4. Cusp 6 is larger than cusp 5.',
      '5. Cusp 6 is much larger than cusp 5.',
    ]
  },
  {
    title: 'Cusp 7 (Metaconulid)',
    desc: 'The metaconulid, which is commonly seen in the first molar, is a cusp located in the lingual groove between cusps 2 and 4.  Use plaque 23.',
    valid_codes: [0, 1, 1, 2, 3, 4, 5],
    codes_desc: [
      '0. No occurrence of cusp 7.',
      '1. Faint cusp is present. Two weak lingual grooves are present instead of one.',
      '1.5. A faint tipless cusp 7 occurs displaced as a bulge on the lingual surface of cusp 2.  Formerly scored as "1A".',
      '2. Cusp 7 is small.',
      '3. Cusp 7 is medium sized.',
      '4. Cusp 7 is large.',
      '5. Cusp 7 is unusually large.',
    ]
  },
  {
    title: "Tome's Root",
    desc: 'This trait is present when the mesial and/or distal root surfaces are deeply grooved.  Use plaque 24.',
    valid_codes: [0, 1, 2, 3, 4, 5, 9],
    codes_desc: [
      '0. Developmental grooving is absent or, if present, shallow with rounded rather than V-shaped indentation.',
      '1. Developmental groove is present and has a shallow V-shaped cross-section.',
      '2. Developmental groove is present and has a moderately deep V-shaped cross-section.',
      '3. Developmental groove is present, V-shaped, and deep.  Groove extends at least one third of the total root length.',
      '4. Developmental grooving is deeply invaginated on both the mesial and distal borders.',
      '5. Two free roots are present.  They are separate for at least one-fourth to one-third of the total root length.',
      '9. Unobservable.',
    ]
  },
];