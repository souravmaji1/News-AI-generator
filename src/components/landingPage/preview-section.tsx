import {
  Bot,
  ChevronRightSquare,
  Palette,
  PawPrint,
  PenTool,
  Settings,
  Settings2,
} from "lucide-react";
import Image from "next/image";
import useResponsiveImage from "~/hooks/useResponsiveImage";
import { capitalizeString } from "~/lib/utils";
import type { GeneratedImages } from "~/pages/generate";
import { AttributeCard } from "../imagePreview/image-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Newslady from '../../../public/dd.webp';

const SampleImage = ({ image }: { image: GeneratedImages[number] }) => {
  const imageWidth = useResponsiveImage();

  return (
    <Card className="shadow-md lg:col-span-2">
      <CardHeader>
        {image.User?.name && (
          <CardTitle>
            Your AI News Video
          </CardTitle>
        )}
      </CardHeader>
      <CardContent>
        <div>
          <Image
            src={Newslady}
            alt="an ai generated dog icon"
            width={imageWidth}
            height={imageWidth}
            className="mx-auto rounded-lg border"
          />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <AttributeCard
            title={"Image source"}
            content="Google"
            icon={<PawPrint className="h-4 w-4 text-muted-foreground" />}
          />
          <AttributeCard
            title={"Script"}
            content="Today's news start from here.."
            icon={
              <ChevronRightSquare className="h-4 w-4 text-muted-foreground" />
            }
          />
          <AttributeCard
            title={"Expression"}
            content="Normal"
            icon={<PenTool className="h-4 w-4 text-muted-foreground" />}
          />
          <AttributeCard
            title="Intensity"
            content="1"
            icon={<Palette className="h-4 w-4 text-muted-foreground" />}
          />
        </div>
      </CardContent>
    </Card>
  );
};

const PreviewSection = ({ image }: { image: GeneratedImages[number] }) => {
  return (
    <section className="container mb-16 px-4 sm:px-8">
      <h2 className="text-center">Powerful Features for AI News Creation</h2>
      <div className="mx-auto mt-10 max-w-5xl lg:grid lg:grid-cols-3 lg:gap-16">
        <SampleImage image={image} />
        <div className="mt-10 space-y-10 lg:col-span-1 lg:my-auto">
          <div>
            <Bot height={30} width={30} />
            <h4 className="mb-4 mt-1">AI Powered:</h4>
            <p>
              Create truly unique AI generated News every time with D-ID&apos;s
              API technology, guaranteeing one-of-a-kind news videos for your
              projects.
            </p>
          </div>
          <div>
            <Settings2 height={30} width={30} />
            <h4 className="mb-4 mt-1">Customization:</h4>
            <p>
              Customize your avatar effortlessly by adding your avatar image link,
              allowing you to adjust intensity, expression, and modifying scripts.
            </p>
          </div>
          <div>
            <Settings height={30} width={30} />
            <h4 className="mb-4 mt-1">High-Quality Output</h4>
            <p>
              Download your AI news video in high-resolution Mp4 without any watermark and
              share links in social media
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PreviewSection;
