"use client";

import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "~/components/ui/carousel";
import { useEffect, useMemo, useState } from "react";
import TeamCarouselItem from "~/components/aboutus_page/TeamCarouselItem";
import { useQuery } from "@tanstack/react-query";
import { getTeam } from "~/server/actions/team";
import { LoadingSpinner } from "~/components/ui/spinner";

const CURRENT_YEAR = "2024-25";

const fetchTeam = async () => {
  const data = await getTeam();
  return data;
};

const TeamTabContent = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const {
    data: team,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["team"],
    queryFn: fetchTeam,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const currentTeam = useMemo(
    () => (team ? team[current] : undefined),
    [team, current],
  );

  useEffect(() => {
    if (!api) {
      return;
    }
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <>
      <h2 className="py-4 text-center text-3xl">Team</h2>
      {isLoading ? (
        <LoadingSpinner className="h-6 w-6" />
      ) : isError ? (
        <div className="text-red-500">Error while fetching team members</div>
      ) : !team?.length || !currentTeam ? (
        <div>No team members to show</div>
      ) : (
        <Carousel
          setApi={setApi}
          className="flex flex-col"
          opts={{ loop: true }}
        >
          <div className="text-muted-foreground flex items-center gap-4 self-center">
            <CarouselPrevious className="static translate-y-0" />
            {currentTeam.year}{" "}
            {currentTeam.year === CURRENT_YEAR ? "(current)" : ""}
            <CarouselNext className="static translate-y-0" />
          </div>
          <CarouselContent className="-ml-4">
            {team.map((el, index) => (
              <TeamCarouselItem {...el} key={index} />
            ))}
          </CarouselContent>
        </Carousel>
      )}
    </>
  );
};

export default TeamTabContent;
