import React from "react";
import styles from "@/styles/about.module.css";
import Image from "next/image";
import pfp from "@/public/pfp.png";
import { Open_Sans } from "next/font/google";
const opensans = Open_Sans({ subsets: ["latin"] });
function About() {
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
            <span>A Close Person</span> - Tuesday, August 22, 2023 - 18:11
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
          ...and that hit me hard. Yes, these messages were from a very close
          person to me who has been a very influence in my life. Let's call this
          person 'A'. Whenever I was doing something A already did, it felt like
          I was following A's footsteps as if I'm seeing myself as A. A really
          helped me forget about my past and gave a hand to hold to get me hopes
          for future. I grew up not having much interactions with others from a
          young age and had participated in only selective conversations in my
          enviroment. A has to be one of the only few persons I liked talking to
          and I could give trust after a very long time to someone. So I held
          A's hand and thought of finally focusing on myself rather than my
          enviroment and move on to doing things I dreamt off as a innocent
          child. I'm not special, nor do I have anything extraordinary but I
          always wanted to do things I liked. Computer Science and the STEM
          field was one of them. The only problem is it's not that easy to get
          into this field, no matter how much you are internested about it. You
          have to score good and be a A+ student to get into good universities.
          So, I had no choice but to also be one of its players. I tried
          studying and kept going on and all I can say about it is that I'm
          average. Extraordinary students are everywhere from earth, who just
          spent a good time working on their abilities. Maybe I didn't. Maybe I
          didn't try hard enough and still some of my abilities are not upto
          extraordinary standards. I fear if I don't have these then maybe I'm
          taking a risk about my dreams. Never have I ever attained a CS class
          officially and the chances of me being able to take one will be hard
          if I kept being like this. Maybe A was right and I hold it to my heart
          even if it hurt first time. I need to remember these words and work on
          myself.
        </p>
      </div>
    </div>
  );
}

export default About;
