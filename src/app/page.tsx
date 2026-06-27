import Hero from '@/components/landing/Hero';
import TrainingModels from '@/components/landing/TrainingModels';
import TrainingTiers from '@/components/landing/TrainingTiers';
import EverythingYouNeed from '@/components/landing/EverythingYouNeed';
import SyllabusMatrix from '@/components/landing/SyllabusMatrix';
import TrainingStrategy from '@/components/landing/TrainingStrategy';
import TrainingSchedule from "@/components/landing/TrainingSchedule";
import FreeResourcesCTA from '@/components/landing/FreeResourcesCTA';
import CourseGrid from '@/components/landing/CourseGrid';
import HowItWorks from '@/components/landing/HowItWorks';
import Testimonials from '@/components/landing/Testimonials';
import BatchCountdown from '@/components/landing/BatchCountdown';
import TutorCTA from '@/components/landing/TutorCTA';

export default function Home() {
  return (
    <main className="bg-white">
      <Hero />
      <TrainingModels />
      <TrainingTiers />
      <EverythingYouNeed />
      {/* New Syllabus Matrix Added Directly Following Your Curriculum Pathway */}
      <SyllabusMatrix />
      <TrainingStrategy />
      <TrainingSchedule />
      <FreeResourcesCTA />
      <CourseGrid />
      <HowItWorks />
      <Testimonials />
      <BatchCountdown />
      <TutorCTA />
    </main>
  );
}