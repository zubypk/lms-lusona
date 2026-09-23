export type HelpLang = "en" | "ur";

export type HelpBlock =
  | { kind: "h2"; text: string }
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "ol"; items: string[] }
  | { kind: "note"; text: string }
  | { kind: "table"; caption: string; headers: string[]; rows: string[][] };

export type HelpArticle = {
  slug: "enrolment" | "attendance" | "results" | "account";
  to: "/help/enrolment" | "/help/attendance" | "/help/results" | "/help/account";
  title: Record<HelpLang, string>;
  summary: Record<HelpLang, string>;
  blocks: Record<HelpLang, HelpBlock[]>;
};

const enrolment: HelpArticle = {
  slug: "enrolment",
  to: "/help/enrolment",
  title: {
    en: "How a class teacher enrols a student",
    ur: "کلاس ٹیچر طالب علم کا اندراج کیسے کرتا ہے",
  },
  summary: {
    en: "The class incharge types a name, a father’s name, and a roll number. The campus issues the email and the password.",
    ur: "کلاس انچارج صرف نام، والد کا نام اور رول نمبر لکھتا ہے۔ ای میل اور پاس ورڈ کیمپس خود جاری کرتا ہے۔",
  },
  blocks: {
    en: [
      {
        kind: "p",
        text: "Enrolment is the class teacher’s job. A parent does not create the student record, and a student does not invent an email address for the college register. The class incharge — the teacher responsible for that section — opens My Class, chooses Enrol, and fills three fields. Academic admin and the campus super admin can enrol as well, and they may pick the class. A subject teacher who is not the class incharge of that section cannot add the student and cannot reset the login.",
      },
      { kind: "h2", text: "The only three fields" },
      {
        kind: "p",
        text: "The desk asks for nothing else. There is no box for a fee, a CNIC, a phone number, a Google account, or a password. The three fields are:",
      },
      {
        kind: "ul",
        items: [
          "Student name. At least two characters, written as the college should store it. Example: Ayesha Khan.",
          "Father’s name. At least two characters. Example: Imran Khan. The register shows this as “S/O” beside the student’s name. It is stored because that is how the class list distinguishes students. It is not a parent login.",
          "Roll number inside that section. Example: 14. The same roll may exist in another section. It may not be repeated inside this section. If it is already used, the desk refuses the save and says that the roll number is already in this class. Nothing is half-saved.",
        ],
      },
      {
        kind: "note",
        text: "A class incharge does not choose a different section. The desk locks the form to the section they actually teach as class teacher. If they are incharge of more than one section, they pick among those sections only.",
      },
      { kind: "h2", text: "What the campus writes after Save" },
      {
        kind: "p",
        text: "When the three fields are accepted, the campus creates the student row and a real email login in one step. The teacher does not type the email. The campus builds it.",
      },
      {
        kind: "ol",
        items: [
          "A student code is issued for this register, in the form AEC-2025-001, AEC-2025-002, and so on. This code is the campus list number. It is not, by itself, a Federal Board registration number and it is not a certificate.",
          "A username is made from the name and the roll. Letters only are kept from the name, cut to eight characters, then the roll is added. “Ayesha Khan” and roll 14 become the username ayeshakh14. If that username is already taken, a digit is added so the two students do not share a login.",
          "The email is that username at the campus mail domain: ayeshakh14@lms.edu.pk. The student signs in with this email and the password on the slip. They do not need a separate mailbox to exist first.",
          "A temporary password is generated in the form Lms# followed by six digits, for example Lms#482913. It is shown once on the login slip. It is not the student’s date of birth, and it is not a password the teacher chose.",
        ],
      },
      { kind: "h2", text: "A worked example" },
      {
        kind: "p",
        text: "Miss Sana is class incharge of Intermediate Year I, section A. She enrols a new student. She types the name Ayesha Khan, the father name Imran Khan, and the roll 14. She does not type an email. She presses save. The desk checks that roll 14 is free in section A, then shows a slip:",
      },
      {
        kind: "table",
        caption: "Login slip for the example. The password is an illustration. A real slip uses a new password each time.",
        headers: ["Line on the slip", "What it means"],
        rows: [
          ["Name", "Ayesha Khan"],
          ["Roll", "14, in her own section only"],
          ["Student ID", "A campus code such as AEC-2025-018"],
          ["Email", "ayeshakh14@lms.edu.pk"],
          ["Username", "ayeshakh14"],
          ["Password", "Lms# and six digits, shown once"],
        ],
      },
      {
        kind: "p",
        text: "Miss Sana copies or prints that slip and gives it to Ayesha, or to her father, once. The slip is the student’s key to this campus. It should not be posted in a class WhatsApp group, pinned on a noticeboard photo, or sent to a stranger who offers to “activate” the account. After the slip is closed, the password is not shown again on the student row. The email and username stay visible to the class teacher so they know which login was issued. The password does not.",
      },
      { kind: "h2", text: "If the password is lost" },
      {
        kind: "p",
        text: "There is no self-service “forgot password” letter on this campus, and the student profile does not contain a password form. The class teacher opens My Class, finds the student, and resets the login. Academic admin or the super admin can reset it too. A subject teacher for another class cannot. The reset writes a new password of the same Lms# form and shows a new slip once. The email stays the same, so the student does not get a second identity. Old passwords stop working. Signing in, failing a sign-in, or resetting a password does not change attendance or marks.",
      },
      { kind: "h2", text: "What enrolment does not do" },
      {
        kind: "ul",
        items: [
          "It does not collect a fee and it does not open a bank, JazzCash, or easypaisa account.",
          "It does not create a Google account or an X account. Google and X on the sign-in page are optional ways for a staff member who already has those accounts. A student’s campus login is the email on the slip.",
          "It does not publish a result, mark a holiday, or enrol the student with a board.",
          "It does not give the father a separate parent login. Parents read this Help section without signing in. The student’s own marks are seen by signing in with the slip.",
          "The public “Enter LMS” button on the home page opens a shared campus desk for trying the site. It is not how a named student is enrolled, and it is not the student’s private account.",
        ],
      },
      {
        kind: "note",
        text: "Keep the printed slip with the family. If two students were given the same slip by mistake, tell the class teacher before anyone changes a password. The teacher can see the name and roll on the class list and issue a fresh slip for the right student.",
      },
    ],
    ur: [
      {
        kind: "p",
        text: "اندراج کلاس ٹیچر کا کام ہے۔ والدین خود ریکارڈ نہیں بناتے، اور طالب علم کالج کے رجسٹر کے لیے خود ای میل نہیں گھڑتا۔ کلاس انچارج — یعنی وہ استاد جو اس سیکشن کا ذمہ دار ہے — مائی کلاس کھولتا ہے، اندراج چنتا ہے، اور تین خانے بھرتا ہے۔ اکیڈمک ایڈمن اور کیمپس کا سپر ایڈمن بھی اندراج کر سکتے ہیں، اور وہ کلاس خود چن سکتے ہیں۔ جو مضمون ٹیچر اس سیکشن کا کلاس انچارج نہیں، وہ نہ طالب علم شامل کر سکتا ہے نہ لاگ اِن بدل سکتا ہے۔",
      },
      { kind: "h2", text: "صرف تین خانے" },
      {
        kind: "p",
        text: "ڈیسک اور کچھ نہیں مانگتی۔ فیس کا خانہ نہیں، شناختی کارڈ نہیں، فون نمبر نہیں، گوگل اکاؤنٹ نہیں، اور پاس ورڈ کا خانہ نہیں۔ تین خانے یہ ہیں:",
      },
      {
        kind: "ul",
        items: [
          "طالب علم کا نام۔ کم از کم دو حرف، اسی طرح جیسے کالج رکھنا چاہے۔ مثال: عائشہ خان۔",
          "والد کا نام۔ کم از کم دو حرف۔ مثال: عمران خان۔ رجسٹر اسے نام کے ساتھ ”S/O“ لکھ کر دکھاتا ہے، تاکہ ایک جیسے نام الگ پہچانے جائیں۔ یہ والد کا لاگ اِن نہیں ہے۔",
          "اسی سیکشن کا رول نمبر۔ مثال: 14۔ یہ رول کسی اور سیکشن میں ہو سکتا ہے۔ اسی سیکشن میں دوبارہ نہیں ہو سکتا۔ اگر پہلے سے موجود ہو تو ڈیسک محفوظ نہیں کرتی اور کہتی ہے کہ یہ رول نمبر اس کلاس میں پہلے سے ہے۔ آدھا ریکارڈ نہیں بنتا۔",
        ],
      },
      {
        kind: "note",
        text: "کلاس انچارج کسی اور سیکشن کا انتخاب نہیں کرتا۔ فارم اسی سیکشن پر بند رہتا ہے جس کے وہ کلاس ٹیچر ہیں۔ اگر ایک سے زیادہ سیکشن ان کے پاس ہوں تو وہ صرف انہی میں سے چن سکتے ہیں۔",
      },
      { kind: "h2", text: "محفوظ کرنے کے بعد کیمپس کیا لکھتا ہے" },
      {
        kind: "p",
        text: "تینوں خانے مان لیے جائیں تو کیمپس ایک ہی قدم میں طالب علم کا اندراج اور حقیقی ای میل لاگ اِن بناتا ہے۔ استاد ای میل نہیں لکھتا۔ کیمپس خود بناتا ہے۔",
      },
      {
        kind: "ol",
        items: [
          "اس رجسٹر کے لیے طالب علم کا کوڈ جاری ہوتا ہے، جیسے AEC-2025-001، AEC-2025-002۔ یہ کیمپس کی فہرست کا نمبر ہے۔ یہ بذات خود فیڈرل بورڈ کا رجسٹریشن نمبر نہیں اور سند نہیں۔",
          "صارف نام نام اور رول سے بنتا ہے۔ نام کے صرف حروف رکھے جاتے ہیں، آٹھ تک کاٹے جاتے ہیں، پھر رول جڑتا ہے۔ ”Ayesha Khan“ اور رول 14 سے صارف نام ayeshakh14 بنتا ہے۔ اگر یہ نام پہلے سے ہو تو ایک ہندسہ جڑ جاتا ہے تاکہ دو طالب علموں کا لاگ اِن ایک نہ ہو۔",
          "ای میل یہی صارف نام کیمپس کے ڈومین پر ہوتی ہے: ayeshakh14@lms.edu.pk۔ طالب علم اسی ای میل اور سلپ کے پاس ورڈ سے داخل ہوتا ہے۔ پہلے سے علیحدہ میل باکس ہونا ضروری نہیں۔",
          "عارضی پاس ورڈ Lms# اور چھ ہندسوں کی شکل میں بنتا ہے، مثلاً Lms#482913۔ یہ لاگ اِن سلپ پر ایک بار دکھایا جاتا ہے۔ یہ تاریخ پیدائش نہیں، اور استاد کا چنا ہوا لفظ نہیں۔",
        ],
      },
      { kind: "h2", text: "ایک مکمل مثال" },
      {
        kind: "p",
        text: "مس سنا انٹرمیڈیٹ سال اول، سیکشن اے کی کلاس انچارج ہیں۔ وہ نئے طالب علم کا اندراج کرتی ہیں۔ نام عائشہ خان، والد کا نام عمران خان، رول 14 لکھتی ہیں۔ ای میل نہیں لکھتیں۔ محفوظ کرتی ہیں۔ ڈیسک دیکھتی ہے کہ سیکشن اے میں رول 14 خالی ہے، پھر سلپ دکھاتی ہے:",
      },
      {
        kind: "table",
        caption: "مثال کی لاگ اِن سلپ۔ پاس ورڈ صرف نمونہ ہے۔ اصلی سلپ ہر بار نیا پاس ورڈ دیتی ہے۔",
        headers: ["سلپ کی سطر", "مطلب"],
        rows: [
          ["نام", "عائشہ خان"],
          ["رول", "14، صرف اسی سیکشن میں"],
          ["طالب علم آئی ڈی", "کیمپس کوڈ، جیسے AEC-2025-018"],
          ["ای میل", "ayeshakh14@lms.edu.pk"],
          ["صارف نام", "ayeshakh14"],
          ["پاس ورڈ", "Lms# اور چھ ہندسے، ایک بار"],
        ],
      },
      {
        kind: "p",
        text: "مس سنا یہ سلپ نقل یا چھپوا کر عائشہ یا اس کے والد کو ایک بار دے دیتی ہیں۔ سلپ اس کیمپس کی کنجی ہے۔ اسے کلاس کے واٹس ایپ گروپ میں نہ لگائیں، نوٹس بورڈ کی تصویر میں نہ چھوڑیں، اور کسی اجنبی کو نہ بھیجیں جو اکاؤنٹ ”چالو“ کرنے کا کہے۔ سلپ بند ہونے کے بعد پاس ورڈ طالب علم کی صف پر دوبارہ نہیں دکھتا۔ ای میل اور صارف نام کلاس ٹیچر کو نظر رہتے ہیں تاکہ پتا چلے کون سا لاگ اِن جاری ہوا۔ پاس ورڈ نہیں رہتا۔",
      },
      { kind: "h2", text: "اگر پاس ورڈ کھو جائے" },
      {
        kind: "p",
        text: "اس کیمپس پر ”پاس ورڈ بھول گئے“ کا خود کار خط نہیں، اور طالب علم کے پروفائل میں پاس ورڈ کا فارم نہیں۔ کلاس ٹیچر مائی کلاس کھول کر طالب علم کو ڈھونڈتا ہے اور لاگ اِن دوبارہ جاری کرتا ہے۔ اکیڈمک ایڈمن یا سپر ایڈمن بھی یہ کر سکتے ہیں۔ کسی اور کلاس کا مضمون ٹیچر نہیں کر سکتا۔ نیا پاس ورڈ پھر Lms# کی شکل میں بنتا ہے اور نئی سلپ ایک بار دکھتی ہے۔ ای میل وہی رہتی ہے، اس لیے دوسری شناخت نہیں بنتی۔ پرانا پاس ورڈ کام نہیں کرتا۔ داخل ہونا، ناکام داخلہ، یا پاس ورڈ بدلنا حاضری یا نمبر نہیں بدلتا۔",
      },
      { kind: "h2", text: "اندراج یہ کام نہیں کرتا" },
      {
        kind: "ul",
        items: [
          "فیس نہیں لیتا اور نہ بینک، جاز کیش یا ایزی پیسہ کا کھاتہ کھولتا ہے۔",
          "گوگل یا ایکس کا اکاؤنٹ نہیں بناتا۔ سائن اِن صفحے پر گوگل اور ایکس ان عملے کے لیے ہیں جن کے یہ اکاؤنٹ پہلے سے ہوں۔ طالب علم کا کیمپس لاگ اِن سلپ کی ای میل ہے۔",
          "نتیجہ شائع نہیں کرتا، چھٹی نہیں لگاتا، اور بورڈ میں داخلہ نہیں کرواتا۔",
          "والد کو الگ والدین لاگ اِن نہیں دیتا۔ والدین یہ رہنمائی بغیر سائن اِن پڑھ سکتے ہیں۔ طالب علم کے اپنے نمبر سلپ سے داخل ہو کر دیکھے جاتے ہیں۔",
          "ہوم پیج کا ”Enter LMS“ بٹن سائٹ آزمانے کے لیے مشترکہ کیمپس ڈیسک کھولتا ہے۔ اس سے کسی نام والے طالب علم کا اندراج نہیں ہوتا، اور یہ اس کا نجی اکاؤنٹ نہیں۔",
        ],
      },
      {
        kind: "note",
        text: "چھپی ہوئی سلپ گھر میں رکھیں۔ اگر غلطی سے دو طالب علموں کو ایک سلپ مل جائے تو پاس ورڈ بدلنے سے پہلے کلاس ٹیچر کو بتائیں۔ استاد کلاس لسٹ پر نام اور رول دیکھ کر صحیح طالب علم کی نئی سلپ نکال سکتا ہے۔",
      },
    ],
  },
};

const attendance: HelpArticle = {
  slug: "attendance",
  to: "/help/attendance",
  title: {
    en: "How attendance is marked and read",
    ur: "حاضری کیسے لگتی ہے اور کیسے پڑھی جاتی ہے",
  },
  summary: {
    en: "A teacher marks present, late, absent, or excused for a class day. The percentage counts present and late over the days that were actually marked.",
    ur: "استاد کلاس کے دن کو حاضر، لیٹ، غیر حاضر یا معذور لکھتا ہے۔ فیصد ان دنوں پر ہے جن پر حاضری واقعی لگائی گئی، اور اس میں حاضر اور لیٹ گنے جاتے ہیں۔",
  },
  blocks: {
    en: [
      {
        kind: "p",
        text: "Attendance in LMS is the class register for a section and a date. It is not a gate scanner, and it is not a guess filled in at the end of the month from memory if the teacher never saved that day. A mark exists only when someone with access to that section saved it. Students open Attendance and see their own row. They do not see the rest of the class. Teachers, the class incharge, academic admin, and the super admin can mark, and only for sections they are allowed to open.",
      },
      { kind: "h2", text: "The four statuses" },
      {
        kind: "p",
        text: "Every saved mark is one of four words. There is no fifth status such as “left early” or “online”. If the college needs a finer note, the teacher records the closest of these four and can say the rest in person. The register itself stores only the status.",
      },
      {
        kind: "table",
        caption: "What each status means on the class register.",
        headers: ["Status", "Meaning on that day", "Counted in the percentage"],
        rows: [
          ["Present", "The student was in class when the register was taken.", "Yes, as attended"],
          ["Late", "The student arrived after the register but was in the class.", "Yes, as attended"],
          ["Absent", "The student was not in the class.", "No. The day still counts in the total."],
          ["Excused", "The absence was accepted as excused, for example illness told to the class teacher.", "No. The day still counts in the total. The word Excused stays visible so the office can see it was not an unmarked day."],
        ],
      },
      {
        kind: "note",
        text: "Excused is not the same as deleting the day. Parents sometimes expect an excused absence to vanish from the percentage. On this campus it does not. The sheet still shows Excused, which is different from Absent, but the percentage is (present + late) divided by every day that has a saved mark. Absent and excused are both saved marks, so both sit in the bottom of the fraction. Only a day with no mark at all is left out.",
      },
      { kind: "h2", text: "How a day is saved" },
      {
        kind: "ol",
        items: [
          "The teacher opens Attendance and selects the section. A class incharge or subject teacher only sees sections they teach. They cannot open another incharge’s register.",
          "They pick the date. The mark is for the class as a whole on that date, not for one subject period. Saving again on the same date replaces the earlier mark for that student and that date. It does not stack a second attendance on top.",
          "Each student on the roll gets one status: present, late, absent, or excused. The roll order is the roll number, not alphabetical.",
          "Save writes the rows. Until Save, nothing has changed. Closing the page without saving leaves yesterday’s register as it was.",
        ],
      },
      { kind: "h2", text: "How the percentage is calculated" },
      {
        kind: "p",
        text: "Look at the days that have a mark for that student. Ignore every date where the cell is empty, because the class was not marked, or that student was not on the roll yet. Call the marked days T. Call present days plus late days P. The percentage is P divided by T, rounded to the nearest whole number. A student with no marked days shows 0%, which means “nothing has been marked”, not “this student missed every day”.",
      },
      { kind: "h2", text: "A worked week" },
      {
        kind: "p",
        text: "Ayesha’s section was marked Monday to Thursday. Friday was a day the teacher did not open the register, so Friday is empty for the whole class. Her marks:",
      },
      {
        kind: "table",
        caption: "One student’s week. Friday is empty, so it is not in the fraction.",
        headers: ["Day", "Mark", "In the total T?", "In the attended P?"],
        rows: [
          ["Monday", "Present", "Yes", "Yes"],
          ["Tuesday", "Late", "Yes", "Yes"],
          ["Wednesday", "Absent", "Yes", "No"],
          ["Thursday", "Excused", "Yes", "No"],
          ["Friday", "Not marked", "No", "No"],
        ],
      },
      {
        kind: "p",
        text: "T is 4. P is 2. The percentage is 2 ÷ 4 = 50%. If someone mistakenly treats Friday as absent, they would be reading a day the teacher never saved. If someone treats Thursday’s excuse as “not a day”, they would say 2 ÷ 3 = 67%, which is not what LMS shows. The honest reading of this campus is 50%, with Thursday still labelled Excused on the sheet so a parent can ask the class teacher about that day without pretending it was never recorded.",
      },
      { kind: "h2", text: "What a parent should check before arguing with the number" },
      {
        kind: "ul",
        items: [
          "Which dates are filled. An empty week is not a zero-attendance week.",
          "Whether late was used. Late still counts as attended. A student who is often late can have a high percentage. The word Late is the record of punctuality; the percentage is the record of being there.",
          "Whether a day says Excused or Absent. Both reduce the percentage the same way. The word is what tells you the class teacher accepted a reason.",
          "That a correction is a new save on that same date by a teacher of that section. A parent cannot edit the cell. Signing in as the student cannot edit it either.",
        ],
      },
      {
        kind: "p",
        text: "Reports for the academic office use the same rule by section: present and late over all saved marks. A printed page or a screenshot does not change the stored status. If the paper in your hand disagrees with the screen, the screen is the register the next save will replace. Ask the class teacher to open that date and read the status aloud before anyone rewrites it.",
      },
    ],
    ur: [
      {
        kind: "p",
        text: "ایل ایم ایس میں حاضری ایک سیکشن اور ایک تاریخ کا کلاس رجسٹر ہے۔ یہ گیٹ کا سکینر نہیں، اور مہینے کے آخر میں یادداشت سے بھری گئی قیاس آرائی نہیں اگر استاد نے وہ دن محفوظ ہی نہ کیا ہو۔ نشان تبھی ہے جب اس سیکشن تک رسائی رکھنے والے نے اسے محفوظ کیا ہو۔ طالب علم حاضری کھول کر اپنی صف دیکھتا ہے۔ باقی کلاس نہیں دیکھتا۔ استاد، کلاس انچارج، اکیڈمک ایڈمن اور سپر ایڈمن نشان لگا سکتے ہیں، اور صرف ان سیکشنز پر جنہیں کھولنے کی انہیں اجازت ہے۔",
      },
      { kind: "h2", text: "چار حالتیں" },
      {
        kind: "p",
        text: "ہر محفوظ نشان ان چار لفظوں میں سے ایک ہے۔ پانچویں حالت نہیں، جیسے ”جلدی چلا گیا“ یا ”آن لائن“۔ اگر کالج کو باریک بات درکار ہو تو استاد ان چار میں قریب ترین لکھتا ہے اور باقی بات زبانی کہہ سکتا ہے۔ رجسٹر میں صرف یہ حالت محفوظ ہوتی ہے۔",
      },
      {
        kind: "table",
        caption: "کلاس رجسٹر پر ہر حالت کا مطلب۔",
        headers: ["حالت", "اس دن کا مطلب", "فیصد میں"],
        rows: [
          ["حاضر", "رجسٹر لیتے وقت طالب علم کلاس میں تھا۔", "ہاں، حاضر گِنا جائے گا"],
          ["لیٹ", "رجسٹر کے بعد آیا مگر کلاس میں تھا۔", "ہاں، حاضر گِنا جائے گا"],
          ["غیر حاضر", "کلاس میں نہیں تھا۔", "نہیں۔ دن کل میں شامل رہتا ہے۔"],
          ["معذور", "غیر حاضری معذور مانی گئی، مثلاً بیماری کلاس ٹیچر کو بتا دی گئی۔", "نہیں۔ دن کل میں شامل رہتا ہے۔ لفظ معذور نظر رہتا ہے تاکہ دفتر جانے کہ یہ خالی دن نہیں تھا۔"],
        ],
      },
      {
        kind: "note",
        text: "معذور ہونے کا مطلب دن مٹا دینا نہیں۔ بعض والدین سمجھتے ہیں کہ معذور غیر حاضری فیصد سے غائب ہو جاتی ہے۔ اس کیمپس پر ایسا نہیں۔ شیٹ پر معذور لکھا رہتا ہے، جو غیر حاضر سے مختلف ہے، مگر فیصد ہے (حاضر + لیٹ) تقسیم ان تمام دنوں پر جن کا نشان محفوظ ہے۔ غیر حاضر اور معذور دونوں محفوظ نشان ہیں، اس لیے دونوں کسر کے نیچے آتے ہیں۔ صرف وہ دن باہر رہتا ہے جس پر کوئی نشان نہیں۔",
      },
      { kind: "h2", text: "دن کیسے محفوظ ہوتا ہے" },
      {
        kind: "ol",
        items: [
          "استاد حاضری کھول کر سیکشن چنتا ہے۔ کلاس انچارج یا مضمون ٹیچر صرف اپنے سیکشن دیکھتا ہے۔ کسی اور انچارج کا رجسٹر نہیں کھول سکتا۔",
          "تاریخ چنتا ہے۔ نشان اس تاریخ کی پوری کلاس کا ہے، ایک مضمون کی پیریڈ کا نہیں۔ اسی تاریخ پر دوبارہ محفوظ کرنے سے اسی طالب علم کا پرانا نشان بدل جاتا ہے۔ اوپر دوسری حاضری نہیں چڑھتی۔",
          "رول کے ہر طالب علم کو ایک حالت ملتی ہے: حاضر، لیٹ، غیر حاضر، یا معذور۔ ترتیب رول نمبر کی ہے، حروف تہجی کی نہیں۔",
          "محفوظ کرنے پر قطاریں لکھی جاتی ہیں۔ تب تک کچھ نہیں بدلتا۔ بغیر محفوظ کیے صفحہ بند کرنے سے کل کا رجسٹر ویسا ہی رہتا ہے۔",
        ],
      },
      { kind: "h2", text: "فیصد کیسے نکلتا ہے" },
      {
        kind: "p",
        text: "وہ دن دیکھیے جن پر اس طالب علم کا نشان ہے۔ ہر وہ تاریخ چھوڑ دیجیے جس کا خانہ خالی ہے، کیونکہ کلاس نہیں لگی یا طالب علم ابھی رول پر نہیں تھا۔ نشان والے دنوں کو T کہیے۔ حاضر اور لیٹ کو ملا کر P کہیے۔ فیصد P تقسیم T ہے، قریب ترین پورے نمبر تک۔ جس طالب علم کا کوئی دن نشان زد نہیں، اس پر 0% آتا ہے، جس کا مطلب ہے ”ابھی کچھ نہیں لکھا گیا“، یہ نہیں کہ ”وہ ہر دن غیر حاضر رہا“۔",
      },
      { kind: "h2", text: "ایک ہفتے کی مثال" },
      {
        kind: "p",
        text: "عائشہ کے سیکشن کی پیر سے جمعرات تک حاضری لگی۔ جمعہ کو استاد نے رجسٹر نہیں کھولا، اس لیے پوری کلاس کا جمعہ خالی ہے۔ اس کے نشان:",
      },
      {
        kind: "table",
        caption: "ایک طالب علم کا ہفتہ۔ جمعہ خالی ہے، اس لیے کسر میں نہیں۔",
        headers: ["دن", "نشان", "کل T میں؟", "حاضر P میں؟"],
        rows: [
          ["پیر", "حاضر", "ہاں", "ہاں"],
          ["منگل", "لیٹ", "ہاں", "ہاں"],
          ["بدھ", "غیر حاضر", "ہاں", "نہیں"],
          ["جمعرات", "معذور", "ہاں", "نہیں"],
          ["جمعہ", "نشان نہیں", "نہیں", "نہیں"],
        ],
      },
      {
        kind: "p",
        text: "T چار ہے۔ P دو ہے۔ فیصد 2 ÷ 4 = 50% ہے۔ اگر کوئی جمعہ کو غلطی سے غیر حاضر گن لے تو وہ ایسا دن پڑھ رہا ہے جو استاد نے محفوظ ہی نہیں کیا۔ اگر کوئی جمعرات کی معذوری کو ”دن ہی نہیں“ مانے تو 2 ÷ 3 = 67% کہے گا، جو ایل ایم ایس نہیں دکھاتا۔ اس کیمپس کی سیدھی پڑھائی 50% ہے، اور جمعرات شیٹ پر معذور لکھا رہتا ہے تاکہ والد کلاس ٹیچر سے اس دن کے بارے میں پوچھ سکیں یہ کہے بغیر کہ وہ لکھا ہی نہیں گیا۔",
      },
      { kind: "h2", text: "نمبر سے بحث کرنے سے پہلے کیا دیکھیے" },
      {
        kind: "ul",
        items: [
          "کون سی تاریخیں بھری ہیں۔ خالی ہفتہ صفر حاضری والا ہفتہ نہیں۔",
          "لیٹ استعمال ہوا یا نہیں۔ لیٹ پھر بھی حاضر گِنا جاتا ہے۔ جو اکثر دیر سے آئے اس کی فیصد اونچی ہو سکتی ہے۔ لفظ لیٹ وقت کی پابندی ہے؛ فیصد موجودگی ہے۔",
          "دن معذور ہے یا غیر حاضر۔ دونوں فیصد ایک ہی طرح گھٹاتے ہیں۔ لفظ بتاتا ہے کہ کلاس ٹیچر نے وجہ مانی یا نہیں۔",
          "درستگی اسی تاریخ پر اس سیکشن کے استاد کا نیا محفوظ کرنا ہے۔ والد خانہ نہیں بدل سکتا۔ طالب علم بن کر داخل ہونے سے بھی خانہ نہیں بدلتا۔",
        ],
      },
      {
        kind: "p",
        text: "اکیڈمک دفتر کی رپورٹ بھی سیکشن پر یہی قاعدہ استعمال کرتی ہے: محفوظ نشانوں پر حاضر اور لیٹ۔ چھپا ہوا صفحہ یا تصویر محفوظ حالت نہیں بدلتی۔ اگر ہاتھ کا کاغذ اسکرین سے مختلف ہو تو اسکرین وہ رجسٹر ہے جسے اگلا محفوظ بدلے گا۔ دوبارہ لکھنے سے پہلے کلاس ٹیچر سے کہیں کہ وہ تاریخ کھول کر حالت پڑھ دے۔",
      },
    ],
  },
};

const results: HelpArticle = {
  slug: "results",
  to: "/help/results",
  title: {
    en: "How to read a result",
    ur: "نتیجہ کیسے پڑھا جائے",
  },
  summary: {
    en: "A result row is subject marks, a total, a percentage, one GPA, and one letter. An empty cell is not a zero. Export and print do not change the stored marks.",
    ur: "نتیجے کی صف مضامین کے نمبر، کل، فیصد، ایک جی پی اے اور ایک گریڈ ہے۔ خالی خانہ صفر نہیں۔ ایکسپورٹ اور پرنٹ محفوظ نمبر نہیں بدلتے۔",
  },
  blocks: {
    en: [
      {
        kind: "p",
        text: "Results is the examination sheet for one sitting: a mid-term, a send-up, or another exam the academic office has stored. You pick the examination from the list at the top. The table then shows, for each student the viewer is allowed to see, the roll, the name, one column per subject that has any score in that exam, then the percentage, the GPA, and the letter. A student signed in with their own slip sees only their row. A class teacher sees the students in reach of their classes. This page is the working campus sheet. It is not, by itself, the Federal Board gazette and it does not replace a signed original from the controller’s office.",
      },
      { kind: "h2", text: "Reading one row" },
      {
        kind: "ul",
        items: [
          "Roll and name identify the student. Match both. A similar name in another section is a different row.",
          "Each subject column is the marks stored for that subject, out of the maximum stored with them. The screen shows the marks figure. The maximum is used in the sum even when the column looks like a single number.",
          "A dash (—) means no score has been saved for that student in that subject. It is not zero. It is not “absent therefore fail”. It is an empty cell.",
          "The percentage is the sum of saved marks divided by the sum of the maxima of those same saved scores, times 100. Subjects with a dash are left out of both sums. A saved zero is included in both sums.",
          "The letter and the GPA are worked from that one percentage, not from a separate GPA in every subject and not from credit hours. There is one letter for the row.",
        ],
      },
      { kind: "h2", text: "Blank is not zero" },
      {
        kind: "p",
        text: "This is the mistake that most often frightens a family. If Mathematics has not been entered, the cell is a dash. Mathematics adds nothing to the total and nothing to the maximum. The percentage is calculated only on the subjects that were actually saved. If a teacher later types 0, that is a real zero: it adds 0 to the marks and it adds the full maximum to the denominator, so the percentage falls. Do not treat a dash as a nought when you recompute the total on paper. Do not ask the teacher to “fill the blank with zero” unless the student truly scored zero.",
      },
      { kind: "h2", text: "A worked sheet" },
      {
        kind: "p",
        text: "Ayesha’s send-up, while Mathematics has not been entered:",
      },
      {
        kind: "table",
        caption: "Saved marks only. Mathematics is blank, so it is outside the sum.",
        headers: ["Subject", "Saved marks", "Maximum", "In the sum?"],
        rows: [
          ["Physics", "72", "100", "Yes"],
          ["Chemistry", "81", "100", "Yes"],
          ["Mathematics", "—", "not saved", "No"],
          ["English", "64", "100", "Yes"],
        ],
      },
      {
        kind: "p",
        text: "Marks total 72 + 81 + 64 = 217. Maximum total 100 + 100 + 100 = 300. Percentage 217 ÷ 300 = 72.3%. On the scale below, 72.3% is a B and the GPA is 3.00. The letter is not an average of four subject letters, because the fourth subject has no letter yet.",
      },
      {
        kind: "p",
        text: "Now suppose Mathematics is saved as 0 out of 100, because that is the true score. Marks stay 217. Maximum becomes 400. Percentage 217 ÷ 400 = 54.3%. That is a D, GPA 1.00. The only thing that changed is that a real zero was stored. The dash and the zero are different facts. Exporting the sheet to CSV, or using Print / PDF, does not turn a dash into a zero and does not write anything back to the register. CSV leaves a blank field empty. Print prints the page you are looking at.",
      },
      { kind: "h2", text: "The letter and GPA scale" },
      {
        kind: "p",
        text: "The campus uses one scale on the overall percentage of saved marks. Boundaries are inclusive at the lower end: 80.0% is an A, 79.9% is a B+.",
      },
      {
        kind: "table",
        caption: "Letter and GPA from the overall percentage. This is not a university transcript and it is not a board formula.",
        headers: ["Percentage", "Letter", "GPA shown"],
        rows: [
          ["85 and above", "A+", "4.00"],
          ["80 up to but not including 85", "A", "3.70"],
          ["75 up to but not including 80", "B+", "3.30"],
          ["70 up to but not including 75", "B", "3.00"],
          ["65 up to but not including 70", "C+", "2.70"],
          ["60 up to but not including 65", "C", "2.30"],
          ["55 up to but not including 60", "D+", "2.00"],
          ["50 up to but not including 55", "D", "1.00"],
          ["Below 50", "F", "0.00"],
        ],
      },
      { kind: "h2", text: "Who can change a mark" },
      {
        kind: "p",
        text: "A teacher of the class, the class incharge, academic admin, or the super admin can save a score. Saving replaces the stored marks for that student, that exam, and that subject. Students cannot type into the cell. Parents cannot. The academic office can mark an examination published, which sends a notice that a result is available. Read the row that is on the screen for the exam you selected. If a subject is still a dash on the morning of a parent meeting, the mark has not been entered yet; it has not been entered as zero.",
      },
      {
        kind: "ul",
        items: [
          "Changing the exam in the dropdown only changes which sitting you are reading. It does not delete the other sitting.",
          "Export CSV downloads a file. It does not submit a correction.",
          "Print / PDF uses the browser’s print dialog. It does not stamp the sheet as an official certificate.",
          "A conversation in the forum, a quiz score, and an assignment grade are different records. This page does not mix them into the exam percentage.",
        ],
      },
      {
        kind: "note",
        text: "If your own arithmetic matches 72.3 and the screen says 72.3, you are reading the saved subjects. If your arithmetic included a zero for the dash, you are not reading the same sum the campus stored. Ask which subjects have a saved maximum before you decide a letter is wrong.",
      },
    ],
    ur: [
      {
        kind: "p",
        text: "نتائج ایک امتحان کی شیٹ ہے: مڈ ٹرم، سینڈ اپ، یا کوئی اور امتحان جو اکیڈمک دفتر نے محفوظ کیا ہو۔ اوپر فہرست سے امتحان چنیے۔ جدول پھر ہر اس طالب علم کے لیے رول، نام، ہر اس مضمون کا کالم جس کا اس امتحان میں کوئی نمبر ہو، پھر فیصد، جی پی اے اور گریڈ دکھاتا ہے جسے دیکھنے والے کو دیکھنے کی اجازت ہو۔ جو طالب علم اپنی سلپ سے داخل ہو وہ صرف اپنی صف دیکھتا ہے۔ کلاس ٹیچر اپنی کلاسوں کے طالب علم دیکھتا ہے۔ یہ صفحہ کیمپس کی کام کی شیٹ ہے۔ یہ بذات خود فیڈرل بورڈ کا گزٹ نہیں اور کنٹرولر کے دستخط شدہ اصل کی جگہ نہیں لیتا۔",
      },
      { kind: "h2", text: "ایک صف کیسے پڑھیں" },
      {
        kind: "ul",
        items: [
          "رول اور نام طالب علم کی پہچان ہیں۔ دونوں ملائیں۔ دوسرے سیکشن کا ملتا جلتا نام دوسری صف ہے۔",
          "ہر مضمون کا کالم وہ نمبر ہے جو اس مضمون کے لیے محفوظ ہے، اسی زیادہ سے زیادہ نمبر میں سے جو ساتھ محفوظ ہے۔ اسکرین نمبر دکھاتی ہے۔ زیادہ سے زیادہ جمع میں استعمال ہوتا ہے چاہے کالم ایک عدد دکھے۔",
          "ڈیش (—) کا مطلب ہے اس طالب علم کے اس مضمون کا کوئی نمبر محفوظ نہیں ہوا۔ یہ صفر نہیں۔ یہ ”غیر حاضر اس لیے فیل“ نہیں۔ یہ خالی خانہ ہے۔",
          "فیصد محفوظ نمبروں کی جمع تقسیم انہی محفوظ نمبروں کے زیادہ سے زیادہ کی جمع، ضرب ۱۰۰ ہے۔ ڈیش والے مضامین دونوں جمعوں سے باہر رہتے ہیں۔ محفوظ صفر دونوں جمعوں میں آتا ہے۔",
          "گریڈ اور جی پی اے اسی ایک فیصد سے نکلتے ہیں، ہر مضمون کے الگ جی پی اے سے نہیں اور کریڈٹ آورز سے نہیں۔ پوری صف کا ایک گریڈ ہے۔",
        ],
      },
      { kind: "h2", text: "خالی خانہ صفر نہیں" },
      {
        kind: "p",
        text: "یہی وہ غلطی ہے جو اکثر گھر والوں کو ڈراتی ہے۔ اگر ریاضی درج نہیں ہوئی تو خانہ ڈیش ہے۔ ریاضی کل میں کچھ نہیں جوڑتی اور زیادہ سے زیادہ میں کچھ نہیں جوڑتی۔ فیصد صرف ان مضامین پر ہے جو واقعی محفوظ ہوئے۔ اگر استاد بعد میں 0 لکھے تو وہ حقیقی صفر ہے: نمبروں میں 0 جڑتا ہے اور زیادہ سے زیادہ پورا نیچے جڑتا ہے، اس لیے فیصد گرتی ہے۔ کاغذ پر کل نکالتے وقت ڈیش کو صفر نہ سمجھیں۔ استاد سے یہ نہ کہیں کہ ”خالی کو صفر سے بھر دیں“ جب تک طالب علم نے واقعی صفر نہ لیے ہوں۔",
      },
      { kind: "h2", text: "ایک شیٹ کی مثال" },
      {
        kind: "p",
        text: "عائشہ کا سینڈ اپ، جب ریاضی ابھی درج نہیں ہوئی:",
      },
      {
        kind: "table",
        caption: "صرف محفوظ نمبر۔ ریاضی خالی ہے، اس لیے جمع سے باہر۔",
        headers: ["مضمون", "محفوظ نمبر", "زیادہ سے زیادہ", "جمع میں؟"],
        rows: [
          ["طبیعیات", "72", "100", "ہاں"],
          ["کیمیا", "81", "100", "ہاں"],
          ["ریاضی", "—", "محفوظ نہیں", "نہیں"],
          ["انگریزی", "64", "100", "ہاں"],
        ],
      },
      {
        kind: "p",
        text: "نمبروں کا کل 72 + 81 + 64 = 217۔ زیادہ سے زیادہ 100 + 100 + 100 = 300۔ فیصد 217 ÷ 300 = 72.3٪۔ نیچے درجے کے مطابق 72.3٪ گریڈ B ہے اور جی پی اے 3.00 ہے۔ یہ گریڈ چار مضامین کے گریڈوں کی اوسط نہیں، کیونکہ چوتھے مضمون کا ابھی کوئی گریڈ نہیں۔",
      },
      {
        kind: "p",
        text: "اب مان لیجیے کہ ریاضی 100 میں سے 0 محفوظ ہو، کیونکہ یہی اصل نمبر ہو۔ نمبر 217 رہتے ہیں۔ زیادہ سے زیادہ 400 ہو جاتا ہے۔ فیصد 217 ÷ 400 = 54.3٪۔ یہ D ہے، جی پی اے 1.00۔ بدلا صرف یہ کہ حقیقی صفر لکھ دیا گیا۔ ڈیش اور صفر دو مختلف باتیں ہیں۔ شیٹ کو CSV میں نکالنا، یا پرنٹ / PDF، ڈیش کو صفر نہیں بناتا اور رجسٹر میں کچھ واپس نہیں لکھتا۔ CSV خالی خانے کو خالی چھوڑتا ہے۔ پرنٹ وہی صفحہ چھاپتا ہے جو آپ دیکھ رہے ہیں۔",
      },
      { kind: "h2", text: "گریڈ اور جی پی اے کا پیمانہ" },
      {
        kind: "p",
        text: "کیمپس محفوظ نمبروں کی مجموعی فیصد پر ایک پیمانہ لگاتا ہے۔ نچلی حد شامل ہے: 80.0٪ گریڈ A ہے، 79.9٪ گریڈ B+ ہے۔",
      },
      {
        kind: "table",
        caption: "مجموعی فیصد سے گریڈ اور جی پی اے۔ یہ یونیورسٹی کا ٹرانسکرپٹ نہیں اور بورڈ کا فارمولا نہیں۔",
        headers: ["فیصد", "گریڈ", "دکھایا گیا جی پی اے"],
        rows: [
          ["85 اور اس سے اوپر", "A+", "4.00"],
          ["80 سے 85 سے کم", "A", "3.70"],
          ["75 سے 80 سے کم", "B+", "3.30"],
          ["70 سے 75 سے کم", "B", "3.00"],
          ["65 سے 70 سے کم", "C+", "2.70"],
          ["60 سے 65 سے کم", "C", "2.30"],
          ["55 سے 60 سے کم", "D+", "2.00"],
          ["50 سے 55 سے کم", "D", "1.00"],
          ["50 سے کم", "F", "0.00"],
        ],
      },
      { kind: "h2", text: "نمبر کون بدل سکتا ہے" },
      {
        kind: "p",
        text: "کلاس کا استاد، کلاس انچارج، اکیڈمک ایڈمن یا سپر ایڈمن نمبر محفوظ کر سکتا ہے۔ محفوظ کرنے سے اسی طالب علم، اسی امتحان اور اسی مضمون کا پرانا نمبر بدل جاتا ہے۔ طالب علم خانے میں نہیں لکھ سکتا۔ والدین نہیں لکھ سکتے۔ اکیڈمک دفتر امتحان کو شائع شدہ نشان زد کر سکتا ہے، جس سے اطلاع جاتی ہے کہ نتیجہ موجود ہے۔ جو امتحان آپ نے چنا ہے، اس کی وہ صف پڑھیں جو اسکرین پر ہے۔ اگر والدین کی میٹنگ کی صبح بھی مضمون ڈیش ہو تو نمبر ابھی درج نہیں ہوا؛ اسے صفر درج نہیں کیا گیا۔",
      },
      {
        kind: "ul",
        items: [
          "فہرست میں امتحان بدلنا صرف یہ بدلتا ہے کہ آپ کون سا امتحان پڑھ رہے ہیں۔ دوسرا امتحان نہیں مٹتا۔",
          "CSV نکالنا فائل اتارتا ہے۔ یہ تصحیح جمع نہیں کرواتا۔",
          "پرنٹ / PDF براؤزر کا پرنٹ ڈائیلاگ استعمال کرتا ہے۔ یہ شیٹ کو سرکاری سند نہیں بناتا۔",
          "فورم کی بات، کوئز کا نمبر، اور اسائنمنٹ کا گریڈ الگ ریکارڈ ہیں۔ یہ صفحہ انہیں امتحان کی فیصد میں نہیں ملا تا۔",
        ],
      },
      {
        kind: "note",
        text: "اگر آپ کا حساب 72.3 ہے اور اسکرین 72.3 کہے تو آپ وہی محفوظ مضامین پڑھ رہے ہیں۔ اگر آپ نے ڈیش کی جگہ صفر جوڑ لیا تو آپ وہ جمع نہیں پڑھ رہے جو کیمپس نے رکھی۔ گریڈ کو غلط کہنے سے پہلے پوچھیں کن مضامین کا زیادہ سے زیادہ نمبر محفوظ ہے۔",
      },
    ],
  },
};

const account: HelpArticle = {
  slug: "account",
  to: "/help/account",
  title: {
    en: "What the campus account is not",
    ur: "کیمپس اکاؤنٹ کیا نہیں ہے",
  },
  summary: {
    en: "A campus login opens this college register. It is not a bank account, a Google account, a social network, a video site, or an advertisement page.",
    ur: "کیمپس لاگ اِن اس کالج کا رجسٹر کھولتا ہے۔ یہ بینک اکاؤنٹ، گوگل اکاؤنٹ، سوشل نیٹ ورک، ویڈیو سائٹ یا اشتہار کا صفحہ نہیں۔",
  },
  blocks: {
    en: [
      {
        kind: "p",
        text: "A campus account is the key the college issued so a named person can open their part of this register: a student sees their attendance and their result row, a class teacher sees their section, an academic officer sees the office tools. The key is an email on @lms.edu.pk and a password, usually the one printed on the login slip. This page is for a parent or a student who has been handed that slip, or who is deciding whether a message about “your LMS account” is real.",
      },
      { kind: "h2", text: "What it is" },
      {
        kind: "ul",
        items: [
          "A sign-in to this Learning Management System only. The address on the slip points at the campus site.",
          "A record tied to a name, a father’s name, and a roll in one section. Those three facts are what the class teacher typed. The password was generated afterwards.",
          "A way to read materials, assignments, quizzes, the timetable, attendance, and results that the college has put in the register for that person.",
          "Something a class teacher can reset. If the slip is lost, the same class teacher, or the academic office, issues a new password. The email does not change.",
        ],
      },
      { kind: "h2", text: "What it is not" },
      {
        kind: "p",
        text: "Read this list before you pay anyone, install anything, or send the slip to a number you do not know.",
      },
      {
        kind: "table",
        caption: "The campus account is often confused with other things. None of these are true.",
        headers: ["It is not", "So you should not"],
        rows: [
          ["A bank account", "Transfer a fee, a “clearance”, or a fine to any person who quotes the student code or the email. LMS does not collect money and does not show a balance."],
          ["JazzCash, easypaisa, or a wallet", "Enter the campus password into a payment app. The password opens the register. It does not authorise a payment."],
          ["A Google account", "Expect Gmail, Drive, or a Google Classroom of your own from this slip. Google on the sign-in page is a different door for people who already have Google. The student’s door is the email on the slip."],
          ["An X or other social account", "Look for followers, posts, or a public profile. There is no feed of classmates to scroll."],
          ["A video site", "Sit through videos to “activate” the account or to unlock a result. Nothing on this campus is locked behind a video."],
          ["An advertisement page", "Click banners, install an app from an ad, or pay for “ad-free results”. The signed-in campus does not run advertisements, and these Help pages do not either."],
          ["A board certificate", "Treat the on-screen letter as the Federal Board document. The letter is the campus scale on saved marks. The board issues its own result."],
          ["A parent login", "Ask for a second password “for the father”. Parents use this public Help without an account. The student account is the student’s."],
        ],
      },
      { kind: "h2", text: "Signing in does not change the academic record" },
      {
        kind: "p",
        text: "Opening the dashboard, failing a password, resetting a password, exporting a CSV, or printing a page does not add a mark, remove an absence, or enrol a subject. Marks change when a teacher saves a score. Attendance changes when a teacher saves a status for a date. Enrolment changes when a class teacher saves a name, a father’s name, and a roll. A student looking at their own row cannot type over it. If a result looks wrong, the conversation is with the class teacher about the saved number, not with a password change.",
      },
      { kind: "h2", text: "The public Enter LMS button" },
      {
        kind: "p",
        text: "The home page has a button labelled Enter LMS. It opens a shared campus desk so a visitor can see how the tools look. That desk is not Ayesha’s account and it is not her father’s account. It does not show her private slip, and using it does not rewrite her marks. A student who wants their own attendance and their own result signs in with the email and password on their slip. If both are used on the same phone, sign out of the desk before judging what “my” result says, or use the slip on a private window.",
      },
      { kind: "h2", text: "How to keep the slip" },
      {
        kind: "ol",
        items: [
          "Store the printed slip at home. The password is shown once when it is issued and once when it is reset.",
          "Do not send a photograph of the slip to a class group. Anyone with the email and the password can open the student’s side of the register.",
          "The campus will not phone you to ask for the password, a card number, or a one-time code. A message that does this is not from this register.",
          "Do not type the campus password into a form that also asks for a wallet PIN or a card.",
          "If the password may have been seen by the wrong person, tell the class teacher and ask for a reset. The new slip retires the old password. Attendance and marks stay as they were.",
        ],
      },
      { kind: "h2", text: "What a honest member of staff will ask" },
      {
        kind: "p",
        text: "The class teacher already knows the name, the father’s name, and the roll, because they typed them. They can see the email on the class list. They do not need you to read the password back to them in order to reset it. The academic office may ask which exam or which date you are asking about. They do not need a payment screenshot to “release” a percentage that is already on the screen. If a stranger’s price is the only way you are being offered a mark, that offer is not how this campus works.",
      },
      {
        kind: "note",
        text: "These Help pages are public on purpose. You do not sign in to read them, you are not asked to watch anything, and there is no advertisement unit on them. When the college is ready to place a manual notice under an article, it will be a notice, not a surprise charge and not a video gate.",
      },
    ],
    ur: [
      {
        kind: "p",
        text: "کیمپس اکاؤنٹ وہ کنجی ہے جو کالج نے جاری کی تاکہ ایک نام والا شخص اس رجسٹر کا اپنا حصہ کھول سکے: طالب علم اپنی حاضری اور اپنی نتیجے کی صف دیکھتا ہے، کلاس ٹیچر اپنا سیکشن دیکھتا ہے، اکیڈمک افسر دفتر کے اوزار دیکھتا ہے۔ کنجی @lms.edu.pk کی ای میل اور پاس ورڈ ہے، عموماً وہی جو لاگ اِن سلپ پر چھپا ہو۔ یہ صفحہ اس والد یا طالب علم کے لیے ہے جسے یہ سلپ ملی ہو، یا جو یہ فیصلہ کر رہا ہو کہ ”آپ کے ایل ایم ایس اکاؤنٹ“ کا پیغام اصلی ہے یا نہیں۔",
      },
      { kind: "h2", text: "یہ کیا ہے" },
      {
        kind: "ul",
        items: [
          "صرف اس لرننگ مینجمنٹ سسٹم میں داخلہ۔ سلپ کا پتا کیمپس سائٹ کی طرف ہے۔",
          "ایک نام، والد کے نام، اور ایک سیکشن کے رول سے جڑا ریکارڈ۔ یہ تین باتیں کلاس ٹیچر نے لکھیں۔ پاس ورڈ بعد میں بنا۔",
          "وہ مواد، اسائنمنٹ، کوئز، ٹائم ٹیبل، حاضری اور نتائج پڑھنے کا طریقہ جو کالج نے اسی شخص کے لیے رجسٹر میں رکھے ہوں۔",
          "ایسی چیز جسے کلاس ٹیچر دوبارہ جاری کر سکتا ہے۔ سلپ کھو جائے تو وہی کلاس ٹیچر، یا اکیڈمک دفتر، نیا پاس ورڈ نکالتا ہے۔ ای میل نہیں بدلتی۔",
        ],
      },
      { kind: "h2", text: "یہ کیا نہیں ہے" },
      {
        kind: "p",
        text: "کسی کو رقم دینے، کچھ نصب کرنے، یا سلپ کسی انجانے نمبر پر بھیجنے سے پہلے یہ فہرست پڑھ لیں۔",
      },
      {
        kind: "table",
        caption: "کیمپس اکاؤنٹ اکثر اور چیزوں سے ملا دیا جاتا ہے۔ ان میں سے کچھ بھی درست نہیں۔",
        headers: ["یہ نہیں ہے", "اس لیے یہ نہ کریں"],
        rows: [
          ["بینک اکاؤنٹ", "طالب علم کے کوڈ یا ای میل کا حوالہ دے کر فیس، ”کلیئرنس“ یا جرمانہ کسی شخص کو نہ بھیجیں۔ ایل ایم ایس رقم نہیں لیتا اور بیلنس نہیں دکھاتا۔"],
          ["جاز کیش، ایزی پیسہ، یا والٹ", "کیمپس کا پاس ورڈ ادائیگی کی ایپ میں نہ لکھیں۔ پاس ورڈ رجسٹر کھولتا ہے۔ ادائیگی کی اجازت نہیں دیتا۔"],
          ["گوگل اکاؤنٹ", "اس سلپ سے اپنی جی میل، ڈرائیو، یا گوگل کلاس روم کی توقع نہ رکھیں۔ سائن اِن پر گوگل الگ دروازہ ہے ان لوگوں کے لیے جن کے پاس گوگل پہلے سے ہو۔ طالب علم کا دروازہ سلپ کی ای میل ہے۔"],
          ["ایکس یا کوئی اور سوشل اکاؤنٹ", "فالوورز، پوسٹس، یا عوامی پروفائل نہ ڈھونڈیں۔ ہم جماعتوں کی کوئی فیڈ نہیں جسے سکرول کیا جائے۔"],
          ["ویڈیو سائٹ", "اکاؤنٹ ”چالو“ کرنے یا نتیجہ کھولنے کے لیے ویڈیو نہ بیٹھیے۔ اس کیمپس پر کچھ بھی ویڈیو کے پیچھے بند نہیں۔"],
          ["اشتہار کا صفحہ", "بینر نہ دبائیں، اشتہار سے ایپ نہ لگائیں، اور ”بغیر اشتہار نتائج“ کی قیمت نہ دیں۔ داخل شدہ کیمپس اشتہار نہیں چلاتا، اور یہ رہنما صفحات بھی نہیں۔"],
          ["بورڈ کی سند", "اسکرین کے گریڈ کو فیڈرل بورڈ کی دستاویز نہ سمجھیں۔ گریڈ محفوظ نمبروں پر کیمپس کا پیمانہ ہے۔ بورڈ اپنا نتیجہ خود جاری کرتا ہے۔"],
          ["والدین کا لاگ اِن", "”والد کے لیے“ دوسرا پاس ورڈ نہ مانگیں۔ والدین یہ عوامی رہنمائی بغیر اکاؤنٹ پڑھتے ہیں۔ طالب علم کا اکاؤنٹ طالب علم کا ہے۔"],
        ],
      },
      { kind: "h2", text: "داخل ہونے سے تعلیمی ریکارڈ نہیں بدلتا" },
      {
        kind: "p",
        text: "ڈیش بورڈ کھولنا، پاس ورڈ غلط ہونا، پاس ورڈ دوبارہ جاری ہونا، CSV نکالنا، یا صفحہ چھاپنا نہ نمبر جوڑتا ہے، نہ غیر حاضری مٹاتا ہے، نہ مضمون کا اندراج کرتا ہے۔ نمبر تب بدلتے ہیں جب استاد نمبر محفوظ کرے۔ حاضری تب بدلتی ہے جب استاد ایک تاریخ کی حالت محفوظ کرے۔ اندراج تب بدلتا ہے جب کلاس ٹیچر نام، والد کا نام اور رول محفوظ کرے۔ طالب علم اپنی صف دیکھ کر اس پر نہیں لکھ سکتا۔ اگر نتیجہ غلط لگے تو بات کلاس ٹیچر سے محفوظ نمبر کی ہے، پاس ورڈ بدلنے کی نہیں۔",
      },
      { kind: "h2", text: "عوامی Enter LMS بٹن" },
      {
        kind: "p",
        text: "ہوم پیج پر Enter LMS لکھا بٹن ہے۔ یہ مشترکہ کیمپس ڈیسک کھولتا ہے تاکہ آنے والا اوزار دیکھ سکے۔ وہ ڈیسک عائشہ کا اکاؤنٹ نہیں اور اس کے والد کا اکاؤنٹ نہیں۔ اس پر اس کی نجی سلپ نہیں کھلتی، اور اسے استعمال کرنے سے اس کے نمبر نہیں لکھے جاتے۔ جو طالب علم اپنی حاضری اور اپنا نتیجہ دیکھنا چاہے وہ سلپ کی ای میل اور پاس ورڈ سے داخل ہوتا ہے۔ اگر ایک ہی فون پر دونوں استعمال ہوں تو ”میرا“ نتیجہ جانچنے سے پہلے ڈیسک سے باہر آ جائیں، یا سلپ نجی ونڈو میں استعمال کریں۔",
      },
      { kind: "h2", text: "سلپ کیسے رکھیں" },
      {
        kind: "ol",
        items: [
          "چھپی سلپ گھر میں رکھیں۔ پاس ورڈ جاری ہوتے وقت ایک بار دکھتا ہے اور دوبارہ جاری ہوتے وقت ایک بار۔",
          "سلپ کی تصویر کلاس گروپ میں نہ بھیجیں۔ جس کے پاس ای میل اور پاس ورڈ ہوں وہ طالب علم والی طرف رجسٹر کھول سکتا ہے۔",
          "کیمپس آپ کو فون کر کے پاس ورڈ، کارڈ نمبر، یا ایک بار کا کوڈ نہیں مانگے گا۔ جو پیغام یہ مانگے وہ اس رجسٹر کی طرف سے نہیں۔",
          "کیمپس کا پاس ورڈ ایسے فارم میں نہ لکھیں جو والٹ کا پن یا کارڈ بھی مانگے۔",
          "اگر پاس ورڈ غلط شخص نے دیکھ لیا ہو تو کلاس ٹیچر کو بتائیں اور نیا پاس ورڈ مانگیں۔ نئی سلپ پرانے پاس ورڈ کو ختم کر دیتی ہے۔ حاضری اور نمبر وہی رہتے ہیں۔",
        ],
      },
      { kind: "h2", text: "ایماندار عملہ کیا مانگے گا" },
      {
        kind: "p",
        text: "کلاس ٹیچر نام، والد کا نام اور رول پہلے سے جانتا ہے، کیونکہ اس نے خود لکھے۔ کلاس لسٹ پر ای میل اسے نظر آتی ہے۔ پاس ورڈ دوبارہ جاری کرنے کے لیے اسے آپ سے پاس ورڈ سننے کی ضرورت نہیں۔ اکیڈمک دفتر پوچھ سکتا ہے کہ آپ کس امتحان یا کس تاریخ کی بات کر رہے ہیں۔ جو فیصد پہلے ہی اسکرین پر ہو اسے ”چھڑانے“ کے لیے ادائیگی کی تصویر نہیں چاہیے۔ اگر کوئی اجنبی نمبر کی قیمت مانگے تو یہ اس کیمپس کا طریقہ نہیں۔",
      },
      {
        kind: "note",
        text: "یہ رہنما صفحات جان بوجھ کر عوامی ہیں۔ انہیں پڑھنے کے لیے سائن اِن نہیں، کچھ دیکھنے کو نہیں کہا جاتا، اور ان پر کوئی اشتہاری خانہ نہیں۔ جب کالج کسی مضمون کے نیچے دستی اطلاع رکھے گا تو وہ اطلاع ہو گی، اچانک قیمت نہیں اور ویڈیو کا دروازہ نہیں۔",
      },
    ],
  },
};

export const HELP_ARTICLES: HelpArticle[] = [enrolment, attendance, results, account];

export function helpArticle(slug: HelpArticle["slug"]) {
  const article = HELP_ARTICLES.find((item) => item.slug === slug);
  if (!article) throw new Error(`Unknown help article: ${slug}`);
  return article;
}
