import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/about")({
  component: About,
});
function About() {
  return (
    <div className="w-full bg-[#101215] text-white">
      <div className="flex h-[38px] items-center border-b border-[#6c6c6cee] px-4 sm:px-5 text-xs">/about</div>
      <div className="flex justify-center p-4 sm:p-8">
        <div className="w-full max-w-2xl px-0 text-center">
          <time className="text-[0.7rem] text-[rgb(148,155,164)]" title="2023-08-22T12:41:40.420Z">
            <span className="mr-1 text-[0.9rem] text-[#eee]">Tuesday, August 22, 2023 - 18:11</span>
          </time>
          <h3 className="mt-1 text-base font-semibold">Why is your brain full off?</h3>
          <span className="text-[0.9rem] leading-7">i didn&apos;t show the solution cuz i think you could solve it</span>
          <br />
          <span className="text-[0.9rem] leading-7"><u>stop thinking about stupid stuffs all the time</u> and put your brain into these things, think more about maths than anything else</span>
          <br />
          <span className="text-[0.9rem] leading-7">when you are bored, <b className="text-[1.1rem] font-semibold sm:text-[1.2rem]">think about how you could make your calculations faster</b></span>
          <br />
          <span className="text-[0.9rem] leading-7">these calculations should be done brain when you are doing an objective paper</span>
        </div>
      </div>
      <div className="mx-auto max-w-4xl px-4 text-[0.87rem] leading-6 sm:px-8 lg:px-12">
        <p className="my-3">...and that hit me hard. These messages came from someone who was very close at the time. I grew up not having many interactions with others from a young age and took part only in a few select conversations in my surroundings. This person was one of the few I could really talk to.</p>
        <p className="my-3">It was rare for someone to point out a flaw to my face, but when it does happen, there has to be a valid reason behind it. I was tired at that time, so much so that I was hesitant to even do basic trigonometric calculations. My brain was as lazy as it could be. Looking at this, there was no reason to question those comments. Especially when you are trying to sit for entrance examinations for universities where they don&apos;t even give you enough time per question. I took some time to reflect on this and realized that not only am I here, but I am also not sufficiently quick at performing basic arithmetic calculations compared to the expected standard. My primary interest lies in understanding how algorithms function or how to find a better one and the reasoning behind their operations, rather than simply solving specific problems fast using formulas given before me without explanation of how they came. Even now, the way we do multiplication and division using the most common algorithms, most of us don&apos;t question why we do it in that way. But I can&apos;t deny that swift mental calculations are a necessity, and there&apos;s no room for excuses for taking longer than the allotted time.</p>
        <p className="my-3">I don't consider myself extraordinary or a genius, but I have always been passionate about pursuing the things I love. One of those passions is Computer Science and the STEM field. However, gaining entry into this field is no easy feat, regardless of one&apos;s level of interest. To get a better education about these subjects, I require to secure a place in prestigious universities, you need to excel academically, striving to be an A+ student. So, I had no choice but to become a participant in this competitive arena. I persevered in my studies, but all I can say is that I&apos;m average compared to others that are above me academically. Extraordinary students abound, individuals who have dedicated significant time to sharpening their abilities. Perhaps I didn&apos;t put in the same level of effort, or maybe some of my abilities haven&apos;t reached the extraordinary standards I aspire to.</p>
        <p className="my-3">I fear if I don't develop these skills, I'm risking my dreams. I have never taken a formal Computer Science class, but I really wish to. The chances of me being able to take one in future will decrease if I continue remaining the same down this path. Perhaps that person was right, and even though it hurt the first time hearing it, I hold those words close to my heart. I need to remember these words and work on myself to be deserving of my dreams. For that, I have to fix my flaws, one at a time, beginning with proving these sentences wrong one day.</p>
        <p className="my-3">This is just a tool for myself to make significant progress on it. There are so many things I have to juggle at the same time. Nevertheless, if you wish to use this as a game, way to pass the time, or anything, feel free to do so. At the end, I know I can't be perfect, but people close to me deserve a better version of me. I can't say they deserve a better person and push them away, because I want their presence forever with me. Then looks like the only option is to be that better person that I wish them to have. Wish me luck and I wish you luck too. Hope this project helps you as I'm hoping it will to me.</p>
      </div>
      <div className="flex justify-center mt-8">
        <a href="https://github.com/inharul/solvexr" className="inline-flex items-center rounded-lg bg-[#9494943f] px-3 py-2 text-[13px]">
          <img src="/github.svg" alt="star on github" width={20} height={20} className="mr-1 h-5 w-5" /> View it on Github
        </a>
      </div>
      <footer className="flex w-full flex-wrap items-center justify-center gap-2 px-4 py-10 sm:py-16">
        <b className="mr-3 text-[13px] font-normal text-[#afafaf]">Made by Inharul.</b>
        <a href="https://github.com/inharul" className="mx-2 hover:opacity-80"><img src="/github.svg" alt="github" width={22} height={22} /></a>
        <a href="https://www.youtube.com/@inharul" className="mx-2 hover:opacity-80"><img src="/yt.svg" alt="youtube" width={22} height={22} /></a>
        <a href="https://discord.gg/CatZ9nSECb" className="mx-2 hover:opacity-80"><img src="/dc.svg" alt="discord" width={22} height={22} /></a>
      </footer>
    </div>
  );
}
