import Image from "next/image";
import { InfoPage } from "@/app/components/templates/infopage";

export default function Home() {
  const headerText = "Welcome to True or False";
  const textRowOne = "This is a web application that allows you to analyze a dataset of true and fake news articles.";
  const textRowTwo = "You can analyze the data by content or by title to see the distribution of true and false news articles by your chosen criteria.";
  const logo = true;

  return (
    <InfoPage headerText={headerText} textRowOne={textRowOne} textRowTwo={textRowTwo} logo={logo} />
  );
}
