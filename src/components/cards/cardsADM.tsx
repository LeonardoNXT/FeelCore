import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-[1vw] *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
      <Card className="@container/card">
        <CardHeader className="pb-3 sm:pb-6">
          <CardDescription className="text-xs sm:text-sm">
            Emoção do Momento
          </CardDescription>
          <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-semibold tabular-nums">
            Feliz
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-xs">
              <IconTrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 sm:gap-1.5 text-xs sm:text-sm pt-0">
          <div className="line-clamp-1 flex gap-1 sm:gap-2 font-medium">
            <span className="truncate">Tendência desse mês ( Neutro )</span>
            <IconTrendingUp className="size-3 sm:size-4 flex-shrink-0" />
          </div>
          <div className="text-muted-foreground text-xs">
            Baseado nos últimos momentos.
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader className="pb-3 sm:pb-6">
          <CardDescription className="text-xs sm:text-sm">
            Qualidade de vida
          </CardDescription>
          <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-semibold tabular-nums">
            Média
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-xs">
              <IconTrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
              -20%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 sm:gap-1.5 text-xs sm:text-sm pt-0">
          <div className="line-clamp-1 flex gap-1 sm:gap-2 font-medium">
            <span className="truncate">Desceu 20% nesse periodo</span>
            <IconTrendingDown className="size-3 sm:size-4 flex-shrink-0" />
          </div>
          <div className="text-muted-foreground text-xs">
            Precisa de mais atenção
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader className="pb-3 sm:pb-6">
          <CardDescription className="text-xs sm:text-sm">
            Contas Criadas
          </CardDescription>
          <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-semibold tabular-nums">
            45.678
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-xs">
              <IconTrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 sm:gap-1.5 text-xs sm:text-sm pt-0">
          <div className="line-clamp-1 flex gap-1 sm:gap-2 font-medium">
            <span className="truncate">Aumentando consideravelmente</span>
            <IconTrendingUp className="size-3 sm:size-4 flex-shrink-0" />
          </div>
          <div className="text-muted-foreground text-xs">
            Engajamento excede metas
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader className="pb-3 sm:pb-6">
          <CardDescription className="text-xs sm:text-sm">
            Transtorno mais visto
          </CardDescription>
          <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-semibold tabular-nums">
            Ansiedade
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-xs">
              <IconTrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              5.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 sm:gap-1.5 text-xs sm:text-sm pt-0">
          <div className="line-clamp-1 flex gap-1 sm:gap-2 font-medium">
            <span className="truncate">Crescendo rápidamente</span>
            <IconTrendingUp className="size-3 sm:size-4 flex-shrink-0" />
          </div>
          <div className="text-muted-foreground text-xs">
            Tome medidas contra a projeção
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
