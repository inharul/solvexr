import React from "react";
import styles from "@/styles/about.module.css";
import Image from "next/image";
import pfp from "@/public/pfp.png";
import yt from "@/public/yt.svg";
import dc from "@/public/dc.svg";
import gh from "@/public/github.svg";
import { Open_Sans } from "next/font/google";
const opensans = Open_Sans({ subsets: ["latin"] });
function AAbout() {
  return (
    <div>
      <div className="pageHeader">/about</div>
      <div className={`${opensans.className} ${styles.msg}`}>
        <div className={styles.msgPfp}>
          <Image
            src={pfp}
            alt="pfp"
            style={{
              height: 60,
              width: 60,
              borderRadius: "50%",
              userSelect: "none",
            }}
            draggable={false}
          />
        </div>
        <div className={styles.msgText}>
          <time
            id={styles.msgTime}
            title="2023-08-22T12:41:40.420Z"
            dateTime="2023-08-22T12:41:40.420Z"
          >
            <span>AA Close Person</span> - Tuesday, AAugust 22, 2023 - 18:11
          </time>
          <h3>Why is your brain full off?</h3>
          <span>i didn't show the solution cuz i think you could solve it</span>
          <br />
          <span>
            <u>stop thinking about stupid stuffs all the time</u> and put your
            brain into these things, think more about maths than anything else
          </span>
          <br />
          <span>
            when you are bored,{" "}
            <b>think about how you could make your calculations faster</b>
          </span>
          <br />
          <span>
            these calculations should be done brain when you are doing an
            objective paper
          </span>
        </div>
      </div>
      <div className={styles.aboutParagraph}>
        <p>
          ...and that hit me hard. These messages came from someone very dear to
          me, a person who has been a very big influence in my life. For the
          sake of this paragraph, let's call this person 'AA.' AA really helped
          me forget about my past and gave me a hand to hold to get hopes for
          future. I grew up not having many interactions with others from a
          young age and had participated only in selective conversations in my
          surrounding. AA was one of the only few individuals I genuinely
          enjoyed talking to and could give my trust to after things happened in
          my past. My teenage just needed a little light to see but AA came in
          illuminating every corner of it. Life is strange and so was me meeting
          a person like this. I can count only a few instances in my life when
          truly good things have happened to me, and this was undoubtedly one of
          the best. I am with a desire to be worthy of such a gift. Holding AA's
          hand, I decided to shift my focus from trying to be like others in my
          surroundings to myself and pursue the dreams I had cherished since
          childhood.
        </p>
        <p>
          It's a rarity for such a caring person to become upset with me, but
          when it does happen, there's usually a valid reason behind it. I was
          tired at that time, so much so that I was hesitant to even do basic
          trigonometric calculations. My brain was lazy as it can be. Looking at
          this, there shouldn't be any doubt for getting a scolding. Especially
          when you are trying to sit for entrance examinations for universities
          where they don't even give you enough time per question. I took some
          time to reflect on this and realized that not only am I here, but I am
          also not sufficiently quick at performing basic arithmetic
          calculations compared to the expected standard. My primary interest
          lies in understanding how algorithms function or how to find a better
          one and the reasoning behind their operations, rather than simply
          solving specific problems fast using formulas given before me without
          explanation of how they came. Even now, the way we do multiplication
          and division using the most common algorithms, most of us don't
          question why we do it in that way. But I can't deny that Swift mental
          calculations are a necessity, and there's no room for excuses for
          taking longer than the allotted time.
        </p>
        <p>
          I'm not extraordinary, nor do I possess any exceptional talents, but I
          have always been passionate about pursuing the things I love. One of
          those passions is Computer Science and the STEM field. However,
          gaining entry into this field is no easy feat, regardless of one's
          level of interest. To get a better education about these subjects, I
          require to secure a place in prestigious universities, you need to
          excel academically, striving to be an A+ student. So, I had no choice
          but to become a participant in this competitive arena. I persevered in
          my studies, but all I can say is that I'm average compared to others
          that are above me academically. Extraordinary students abound,
          individuals who have dedicated significant time to sharpening their
          abilities. Perhaps I didn't put in the same level of effort, or maybe
          some of my abilities haven't reached the extraordinary standards I
          aspire to.
        </p>
        <p>
          I fear if I don't have these then maybe I'm taking a risk about my
          dreams. Never have I ever attained a Computer Science class
          officially, but I really wish to. The chances of me being able to take
          one in future will decrease if I continue remaining the same down this
          path. Perhaps AA was right, and even though it hurt the first-time
          hearing that, I hold those words close to my heart. I need to remember
          these words and work on myself to be deserving of my dreams and AA as
          well. AA can't live forever with me, so I have to take care of myself.
        </p>
        <p>
          This is just a tool for myself that I made to make a significant
          progress regarding it. There are so many things I have to take care of
          at the same it. Nevertheless, if you wish to use this as a game,
          passing time partner, or anything, feel free to do so. At the end, I
          know I can't be perfect, but AA and people close to me always deserves
          a better human with them for me. I can't say they deserve a better
          person and push them away, because I want their presence forever with
          me. Then looks like the only option is to be that better person that I
          wish them to have. Wish me luck and I wish you luck too. Hope this
          project helps you as I'm hoping it will to me.
        </p>
      </div>
      <p id="OSIstatement" className={styles.osiPara}>
        Solvexr only uses OSI logo at its homepage for showing support for{" "}
        <a
          href="https://opensource.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open Source Initiative
        </a>
        . Solvexr, itself is an open source project. Thus, rather using the logo
        to indicate it is one of the projects contributing to the open source
        community as well as making people aware of the initiative. Solvexr
        never claims to combine its name or its creator's name with the OSI name
        or use the OSI name in a way that it could be perceived that OSI and it
        has an organizational link such as a joint venture. The OSI logo
        trademark is the trademark of Open Source Initiative.
      </p>
      <a
        href="https://github.com/inharul/solvexr"
        className={styles.starButton}
      >
        <Image
          src={gh}
          alt="star on github"
          style={{
            width: 20,
            height: 20,
            marginRight: 5,
          }}
        />
        View it on Github
      </a>

      <footer className={styles.socials}>
        <b>Made by Inharul.</b>
        <ul>
          <a href="https://github.com/inharul">
            <Image src={gh} alt="github" />
          </a>
          <a href="https://www.youtube.com/@inharul">
            <Image src={yt} alt="youtube" />
          </a>
          <a href="https://discord.gg/CatZ9nSECb">
            <Image src={dc} alt="discord" />
          </a>
        </ul>
      </footer>
    </div>
  );
}

export default AAbout;
