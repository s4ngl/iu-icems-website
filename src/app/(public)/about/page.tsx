import type { Metadata } from "next";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "About — IC-EMS at IU",
  description:
    "Meet the IC-EMS board members, field supervisors, and advisors at Indiana University.",
};

interface TeamMember {
  name: string;
  title: string;
  bio: string;
}

const boardMembers: TeamMember[] = [
  {
    name: "Riya Patel, EMT-B",
    title: "Agency Chief",
    bio: "I am a third year from Zionsville, IN majoring in Environmental Health with a minor in Homeland Security. Since earning my EMT-B in high school, I\u2019ve been actively involved in the IU and Bloomington community as an EMT for IC-EMS and IU Health LifeLine. Additionally, I TA for the EMT class, serve as a Peer Mentor for the School of Public Health and am involved with the Hiking Club, and HOSA \u2014 Future Health Professionals. In my free time, I enjoy hiking, climbing, and hanging with my cat. After I graduate from IU, I plan to further my education by obtaining my Paramedic License and pursuing Community Paramedicine/MIH where I will aim to expand access to pre-hospital care and improve community health outcomes.",
  },
  {
    name: "Ananya Balaji, EMT-B",
    title: "Deputy Chief Education",
    bio: "I am a junior from Greenwood, IN double majoring in Neuroscience and Molecular Life Sciences and minoring in Mathematics. I have been a part of IC-EMS since my freshman year. I volunteer as an EMT and AHA BLS Instructor for IC-EMS. I also work as an EMT in Monroe County for IU Health LifeLine. Outside of IC-EMS, I am an undergraduate research assistant in Dr. Andrea Hohmann\u2019s Pain and Addiction Lab and am involved in many other organizations on campus. After graduation, I hope to attend medical school to pursue a career as a clinical research physician and make a substantial impact on the lives of others and the field of medicine.",
  },
  {
    name: "Shane Hart, EMT-B",
    title: "Division Chief Training",
    bio: "I\u2019m a senior here at IU studying biology with minors in ASL, Spanish, and Sociology. I plan to apply to Physician Assistant (PA) school within the next year. I\u2019ve been with IC-EMS since I was a freshman (longest of anyone!), working as a Field Supervisor, Supplies Director, Certification Director, and now Chief of Clinical Training. I have also worked for IU Health LifeLine for two years and recently finished my Advanced-EMT class. I have a strong passion for education and have many plans for the organization in my final year! In my free time, I spend a lot of time swimming, walking my dog, or going out for a drink with my friends/boyfriend.",
  },
  {
    name: "Ashlyn Cheesman, EMT-B",
    title: "Division Chief Quality Assurance",
    bio: "I am a senior from Lafayette, Indiana studying exercise science with a minor in medical sciences. I joined IC-EMS my junior year to gain more patient care experience, serve the Bloomington community, and connect with other students who are passionate about EMS. Outside of IC-EMS, I serve on the volunteer fire department in my hometown as an EMT. I also serve on the leadership team for IU Christian Student Fellowship. After graduating in the spring, I plan to attend PA school and pursue a career in emergency medicine.",
  },
  {
    name: "Aidan Robles",
    title: "Certifications Admin",
    bio: "I\u2019m a sophomore from Fort Wayne Indiana, majoring in Environmental Geoscience. I earned my EMT-B in high school and joined IC-EMS my freshman year. I currently work as a first responder at IU RecSports and outside of IC-EMS I enjoy hiking and camping. After college I hope to pursue a career in park rescue.",
  },
  {
    name: "Anton Kiselev, EMT-B",
    title: "Deputy Chief Integration",
    bio: "I am a Junior from Carmel, Indiana majoring in Neuroscience and minoring in psychology and chemistry. I joined IC-EMS my freshman year to get my foot in the door in medicine early on, through this club I got my BLS and first aid certifications and further getting my EMT certification last summer. As a pre-med student, I felt like there weren\u2019t many options to get hands-on in the field so as an EMT and being part of IC-EMS I could explore my passion for medicine while also volunteering with like-minded fantastic people and mentors in the field while still being in undergrad. Outside of IC-EMS, I am the president of Neuroscience Club.",
  },
  {
    name: "Rachel Hoffman",
    title: "Division Chief Membership",
    bio: "I am a senior at IU from Indianapolis, IN majoring in biochemistry and Spanish. I joined IC-EMS during my freshman year as an opportunity to network and practice patient care. Through Little 500 practices and races, games, simulations, and other IC-EMS events, I have truly found a love and a passion for this organization and for emergency medicine. IC-EMS inspired me to become an EMT, and I now use that certification to work as an EMT with IU Health LifeLine as well as with IC-EMS. Outside of emergency medicine, I am also a UTA for BIOL-L 112, and I spend my free time hiking, reading, and trying to keep all my plants alive. After graduation, I plan on taking a few gap years before attending medical school to pursue a career as a physician!",
  },
  {
    name: "Garrett Ganczak",
    title: "Division Chief Staffing",
    bio: "I\u2019m a junior from Elkhart, Indiana majoring in Biology with a minor in Chemistry. I joined IC-EMS sophomore year in the fall after obtaining my EMT-B here at IU freshman year and meeting one of my good friends in the class who encouraged me to join the club. I hope to remain in emergency medicine and pursue a career as a Physician Assistant after school. I will be working under the Personnel Department this year and look forward to meeting new members as well as football and little 500 events!",
  },
  {
    name: "Jenna Spaeth, EMT-B",
    title: "Social Media Specialist",
    bio: "I\u2019m a sophomore from Ashburn, Virginia majoring in Human Biology with a minor in Spanish. I joined IC-EMS during my freshman year in hopes to kickstart my medical career with volunteer service. I started with obtaining my BLS and first aid certification and recently completed a summer course to become an EMT. IC-EMS has been beneficial in providing hands-on learning experiences for aspiring medical professionals. From aiding in sports events like hockey or the Little 500 races, to practicing a mass casualty incident, these experiences have reinforced my commitment to pursuing a career in medicine. Aside from IC-EMS, I\u2019m a buddy in the Best Buddies club at IU, where I enjoy supporting and connecting with individuals in our community.",
  },
  {
    name: "Dirk Hildebrand",
    title: "Deputy Chief Operations",
    bio: "I am a Junior from Fort Wayne, Indiana majoring in Bioengineering with a minor in Chemistry. I joined IC-EMS at the beginning of my freshman year and the organization\u2019s ability to serve its community and educate others in emergency medicine has inspired me to earn my own EMT certification. I love being able to help and treat others, and events like the Little 500 practices and Hockey were some of my favorite parts about volunteering. After college, I plan to continue my education by attending Dental school to become an Oral Maxillofacial Surgeon. Outside of IC-EMS, I work as a research assistant for the Kinsey Institute\u2019s Socioneural Physiology Lab. In my free time, I love to play sports, some of my current favorites include pickleball, tennis, and lacrosse.",
  },
  {
    name: "Alexis Gerber, EMT-B",
    title: "Division Chief Finance",
    bio: "I am a Junior from Evansville, Indiana majoring in Human Biology with two minors in Medical Sciences and Psychology. I joined IC-EMS in the fall of my freshman year to gain real patient care experience at IU events including Little 500, Football, Basketball, and Hockey games. Along the way, I met some of my closest friends and have continued to grow my passion for medicine. I quickly became BLS/CPR & First Aid certified through this organization and gained my EMT-B certification in 2023. Outside of IC-EMS, I work at Deaconess EMS as an EMT-B in 51 counties, am a Safety Lead and Defensive player on the IU Womens Lacrosse team, and work part-time as a Registered Behavior Technician. After graduation, I plan on attending a Physician Associates program to pursue a career in Obstetrics and Gynecology.",
  },
  {
    name: "Maddy Johnson, EMT-B",
    title: "Division Chief Events",
    bio: "I am a junior from Los Angeles California majoring in Exercise Science with a minor in American Sign Language. I joined IC-EMS in my sophomore year to get hands-on experience with patient care and emergency medicine. Outside of IC-EMS, I am a part of the ASL club and Pre-PA club also, I enjoy hiking, rock climbing, and hanging out with my friends! After graduation, I plan to take a gap year to continue to develop my patient care experience and to travel. After that, I plan to attend Physician Assistant School!",
  },
  {
    name: "Jacob Kurlander, EMT-B",
    title: "Communications Specialist",
    bio: "I am a senior from Carmel, Indiana majoring in biology and community health. I joined IC-EMS my freshman year with little knowledge of emergency medicine and immediately became hooked. IC-EMS has instilled in me confidence as a healthcare provider and inspired me to get my EMT-B certification last summer. I currently work as a first responder at IU RecSports. Outside of IC-EMS, I enjoy playing pickleball and hiking. I am also involved in IU dance marathon and work in a research lab. After graduation, I hope to attend medical school and pursue a career as a physician.",
  },
  {
    name: "Sabri Hamza",
    title: "Technology Director",
    bio: "I am a junior from Carmel, IN pursuing a B.S. in Biochemistry. I joined IC-EMS during my freshman year as a first aid and quickly developed my passion for emergency medicine. The fast-paced environment and a thoughtful community allow for a place to expand knowledge of EMT skills. During my free time, I like to program, play sports recreationally, and spend time with my friends. After graduation, I plan on attending medical school to expand my scope of practice in emergency medicine.",
  },
  {
    name: "Nicky Goh",
    title: "Technology Director",
    bio: "I am a senior from Bloomington, IN, studying Intelligent Systems Engineering. I joined IC-EMS in my sophomore year before becoming an EMT-B and later a field supervisor. Besides my studies, I enjoy hiking, traveling, and cooking. Recently, I interned at Stryker, working on clinical software for the Mako surgical robotics system. Post-graduation, I aim to pursue a career that combines my interests in artificial intelligence and medicine.",
  },
  {
    name: "Adhitya Balaji, BS, EMT-B",
    title: "Graduate Advisor",
    bio: "Adhitya Balaji is currently a MS-2 at the IU School of Medicine. Adhitya joined IC-EMS during his freshman year of undergrad, serving as the Co-President his senior year prior to becoming the Graduate Advisor. He graduated from IU in May 2023, double majoring in Molecular Life Sciences and Neuroscience with a minor in Economics. Adhitya is involved in quality assurance and education for IU Health LifeLine, supporting critical care transport teams, 911 services, and interfacility transport. He also works as an EMT in Lawrence and Monroe County for IU Health LifeLine. Adhitya serves as a member of the American Heart Association Training Faculty at IU Health Bloomington and as the Director of Midwest Outreach for the Journal of Collegiate EMS. Adhitya is an active researcher with research interests in EMS, simulation, quality improvement, and medical education. After medical school, Adhitya plans to pursue clinical interests in emergency medicine with an eventual fellowship in pre-hospital medicine.",
  },
  {
    name: "Dr. David Rodgers, EdD, NRP, FAHA, FSSH",
    title: "Faculty Advisor",
    bio: "David Rodgers is the director of the Interprofessional Simulation Center on the Regional Academic Health Center campus of Indiana University, Bloomington. He is also an assistant professor of clinical medicine in the IU School of Medicine. Dr. Rodgers earned his doctorate in Curriculum and Instruction and a Master of Arts in Communication Studies from Marshall University. He earned a Bachelor of Science in Journalism from West Virginia University. Clinically, he is a national registered paramedic with over 40 years of experience including time as a flight paramedic, EMS supervisor, and manager of a hospital-based critical care transport service. He is active as a researcher and writer, serves as a reviewer for several journals and has published over 35 peer-reviewed manuscripts and abstracts and over 120 conference presentations. He is currently on the editorial board for Simulation in Healthcare, the leading simulation-based healthcare journal, and is an associate editor for Simulation and Gaming, the oldest simulation-based education journal. His contributions to health professions education have been recognized with selection as a Fellow of the American Heart Association (FAHA) and Fellow of the Society for Simulation in Healthcare (FSSH).",
  },
  {
    name: "Dr. Andrew Watters, MD, FACEP, FAWM",
    title: "Medical Director",
    bio: "Dr. Drew Watters, MD FACEP FAWM, grew up in the woods near Bloomington, and returned to practice medicine as an emergency physician in 2007. He has served as medical director of the IU Health emergency department, as a clinical professor for the IU School of Medicine, and as a medical consultant for EMS activities at IU. In addition to his clinical practice as a physician in the ER, he also is a member of FEMA Urban Search and Rescue Team IN-TF1 and serves as the Associate Medical Director for IU Health LifeLine. He has practiced medicine around the world over the past 2 decades, with a focus on wilderness/austere medicine, teaching, and EMS.",
  },
];

const fieldSupervisors: TeamMember[] = [
  {
    name: "Daniel Musapatika, EMT-B",
    title: "Field Supervisor",
    bio: "I\u2019m a senior majoring in Human Biology and minoring in Chemistry and Psychology. I joined IC-EMS my freshman year because I wanted to be a part of an organization where I could physically apply my medical knowledge and serve the IU community. I got my EMT-B certification the second semester of my sophomore year. Outside of IC-EMS, I am a UTIN for c-116, a member of Phi Delta Epsilon medical fraternity, a member of MAPS (Minority Association of Premedical Students), and a research technician for a microbiology lab. As for my hobbies, I like cooking, reading, working out, and playing video games. After graduation, I plan on attending medical school to potentially pursue a career somewhere in pediatric medicine.",
  },
  {
    name: "Kaitlyn Brake",
    title: "Field Supervisor",
    bio: "I am a senior from Zionsville, Indiana majoring in Philosophy and Political Science with a minor in Ethics. I joined IC-EMS spring semester of my freshman year after hearing good things about the organization from other students in my EMT course. I decided to join in order to practice and build upon my EMT skills and get more involved around campus. On top of IC-EMS, I also volunteer as a TA in the EMT course on campus, work for IU Health LifeLine as an EMT, and work for the Rec Sports risk management team. When I\u2019m not doing something EMT related I love playing cards, reading, going on walks/hikes, and playing with my cat. After graduation, I plan to pursue a career field studying human behavior and decision making.",
  },
  {
    name: "Dulce Withrow, EMT-B",
    title: "Field Supervisor",
    bio: "I am a sophomore from Cincinnati, Ohio majoring in Human Biology with a concentration in Human Health and Disease and minors in Chemistry and Spanish. I joined IC-EMS the fall of my freshman year to gain real patient contact hours along with meeting people of similar interest. Once I heard about the club, I immediately signed up to be BLS/CPR & First Aid certified through a class provided by IC-EMS to volunteer for school events. And now I have recently gained my EMT-B over this past summer. Outside of IC-EMS, I am part of Phi Delta Epsilon and Med Life Club, where I volunteer within the community. I have thoroughly enjoyed meeting everyone in the club and growing my love of medicine. With that, I am striving to attend medical school in the future and becoming a Pediatric Ear, Nose and Throat specialist.",
  },
  {
    name: "Megan Mahon, EMT-B",
    title: "Field Supervisor",
    bio: "I am a Sophomore from Carmel, Indiana. I\u2019m studying Community Health with a minor in Global Health Promotion. I joined IU-ICEMS during my freshman year in the fall and got my EMT-B in the spring. I love the opportunities to work with the IU community through events and get hands-on patient contact. Outside of IC-EMS my favorite hobbies are running and reading. After graduation, I plan to pursue a Master of Public Health and work in the field of Public Health.",
  },
  {
    name: "Jadan Bourne",
    title: "Field Supervisor",
    bio: "I am a Senior from South Dakota studying Biology. I have worked at LifeLine as an EMT for the past two years and thought that IC-EMS would be a good way to learn more and teach others. Outside of school and work, you can usually find me outside climbing, hiking, or lounging.",
  },
];

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <Card>
      <CardHeader>
        <Badge variant="outline" className="w-fit">
          {member.title}
        </Badge>
        <CardTitle className="mt-1">{member.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{member.bio}</p>
      </CardContent>
    </Card>
  );
}

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-center text-4xl font-bold tracking-tight">
        Meet Our Team
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
        IC-EMS is powered by dedicated students, experienced advisors, and
        medical professionals committed to serving the Indiana University
        community.
      </p>

      <Separator className="my-12" />

      {/* Board Members */}
      <h2 className="text-2xl font-bold">Board Members</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {boardMembers.map((member) => (
          <TeamCard key={member.name} member={member} />
        ))}
      </div>

      <Separator className="my-12" />

      {/* Field Supervisors */}
      <h2 className="text-2xl font-bold">Field Supervisors</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {fieldSupervisors.map((member) => (
          <TeamCard key={member.name} member={member} />
        ))}
      </div>
    </section>
  );
}
