import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Head from "next/head";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import type { RouterOutputs } from "~/utils/api";
import Unauthenticated from "./unauthenticated";
import { TextField } from "@mui/material";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Button from "@mui/material/Button";
import FormLabel from "@mui/material/FormLabel";

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  CircularProgress
} from '@mui/material';



export type GeneratedImages = RouterOutputs["generate"]["generateIcon"];



const expressions = ['surprise', 'happy', 'serious', 'neutral'];
  
const GeneratePage: NextPage = () => {
  const [generatedImages, setGeneratedImages] = useState<GeneratedImages>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const [videoUrl, setVideoUrl] = useState(null);
  const [sourceUrl, setSourceUrl] = useState('');
  const [inputText, setInputText] = useState('');
  const [selectedExpression, setSelectedExpression] = useState(expressions[0]);
  const [startFrame, setStartFrame] = useState(0);
  const [intensity, setIntensity] = useState(0);

  

  const makeApiCall = async () => {
    setIsGenerating(true);
    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ZWVzZHNzZHNAZ21haWwuY29t:8JdVTXmYjuHZJYczcaGuH`
      },
      body: JSON.stringify({
        source_url: sourceUrl,
        script: {
          type: 'text',
          input: inputText,
          subtitles: false,
          provider: {
            type: 'microsoft',
            voice_id: 'en-US-JennyNeural'
          },
          ssml: false
        },
        config: {
          fluent: false,
          pad_audio: 0.0,
          driver_expressions: {
            expressions: [
              {
                "start_frame": startFrame,
                "expression": selectedExpression,
                "intensity": intensity,
            }
            ]
          }
        }
      })
    };

    try {
      const response = await fetch('https://api.d-id.com/talks', options);
      const data = await response.json();
      const talkId = data.id;

      // Poll the API to check if the video is ready
      const pollVideoStatus = async () => {
        const talkUrl = `https://api.d-id.com/talks/${talkId}`;
        const response = await fetch(talkUrl, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Basic ZWVzZHNzZHNAZ21haWwuY29t:8JdVTXmYjuHZJYczcaGuH`
          },
        });
        const videoData = await response.json();
        console.log(videoData);

        if (videoData.status === 'done') {
          setVideoUrl(videoData.result_url);
        } else {
          setTimeout(pollVideoStatus, 1000); // Poll again after 1 second
        }
      };

      pollVideoStatus(); // Start polling for video availability
      setIsGenerating(false);
    } catch (error) {
      console.error(error);
    }
  };

  const { resolvedTheme } = useTheme();

  const { status } = useSession();

  if (status === "unauthenticated") {
    return <Unauthenticated />;
  }

  return (
    <>
      <Head>
        <title>newsai - Generate AI News in 1 minute</title>
        <meta
          name="woofai AI powered dog icon generator"
          content="generate page for dog icon generator app"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto my-8 flex flex-col px-4 sm:my-12 sm:px-8">
        <div className="grid lg:grid-cols-5 lg:gap-6 xl:grid-cols-3">
          <Card className="min-h-[288px] w-full lg:col-span-2 lg:mr-8 xl:col-span-1">
            <CardHeader>
              <CardTitle className="font-clash">Generate 🤖</CardTitle>
            </CardHeader>
          
            <FormLabel sx={{color:'white',padding:'1.5rem',fontFamily:"__archivo_093692"}}>1. Add your Avatar Image Link
        <TextField
        sx={{color:'white',background:'#141111',margin:'15px 30px 30px 30px',width:'88%'}}
        value={sourceUrl}
        onChange={(e) => setSourceUrl(e.target.value)}
        fullWidth
        margin="normal"
      />
      </FormLabel>
      <br />
      <FormLabel sx={{color:'white',padding:'1.5rem',fontFamily:"__archivo_093692"}} >2. Add your News Script
        
        <TextareaAutosize
        placeholder="Today's news start from here...."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        minRows={4}
        maxRows={4}
        style={{ width: '88%', margin: '9px 26px 26px 26px', padding:'1.5rem', background:'#141111',height:'75px' }}
      />
      </FormLabel>


      <FormControl fullWidth margin="normal">
        <InputLabel sx={{position:'relative',color:'white',margin:"-10px",fontSize:'20px',fontFamily:"__archivo_093692"}}>3. Expression</InputLabel>
        <Select
           sx={{width:'88%',background:'#141111',color:'grey',fontFamily:"__archivo_093692"}}
          value={selectedExpression}
          onChange={(e) => setSelectedExpression(e.target.value)}
        >
          {expressions.map((expression) => (
            <MenuItem key={expression} value={expression}>
              {expression}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

    <div style={{marginTop:'30px'}}>

      <FormLabel sx={{color:'white',padding:'1.5rem',marginTop:"30px",fontFamily:"__archivo_093692"}}>4.Start Frame</FormLabel>
      <Slider
      sx={{width:'84%',margin:'auto',display:"flex"}}
        value={startFrame}
        onChange={(e, value) => setStartFrame(value as number)}
        valueLabelDisplay="auto"
        min={0}
        max={200} // You can adjust the max frame according to your requirements
        step={1}
        marks
      />

      <br></br>

<FormLabel sx={{color:'white',padding:'1.5rem',fontFamily:"__archivo_093692"}}>5.Intensity</FormLabel>
      <Slider
         sx={{width:'84%',margin:'auto',display:"flex"}}
        value={intensity}
        onChange={(e, value) => setIntensity(value as number)}
        valueLabelDisplay="auto"
        min={0}
        max={1}
        step={0.1}
      />
      </div>
      <br />

      <Button
      sx={{display:'flex',margin:'auto',fontFamily:"__archivo_093692"}}
        variant="contained"
        color="success"
        onClick={makeApiCall}
      >
        Generate News
      </Button>

      <br></br>

          </Card>

          <Card
            className={`mt-8 ${
              generatedImages.length > 0 ? `flex` : `hidden lg:flex`
            } w-full flex-col lg:col-span-3 lg:mt-0 xl:col-span-2`}
          >
            <>
              <CardHeader>
                <CardTitle className="font-clash">Output</CardTitle>
              </CardHeader>

              {isGenerating && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
          <CircularProgress color="secondary" />
        </div>
      )}
                   
             
                <ScrollArea className="pb-8 lg:h-[526px]">
                  <CardContent className="flex-grow">
                  {videoUrl && (
        <div>
          <h2>Your AI News is Ready🎉</h2>
          <br></br>
          <video style={{borderRadius:"20px"}} src={videoUrl} controls width="640" height="360"></video>
        </div>
      )}
           
                  </CardContent>
                </ScrollArea>
             
            </>
          
          </Card>
        </div>
      </main>
    </>
  );
};

export default GeneratePage;
