import * as React from 'react';
import { useState } from 'react';
import { ChevronsUpDown } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '~/components/ui/sidebar';
import { useAvailableFarms } from '~/modules/farm/hooks/use-available-farms';
import { useSelectedFarm } from '~/modules/farm/hooks/use-selected-farm';
import { useTranslation } from 'react-i18next';
import { err, errAsync, ok, okAsync } from 'neverthrow';

export function FarmSwitcher() {
  const { isMobile } = useSidebar();
  const availableFarmResult = useAvailableFarms()?.andThen(farms => {
    if (farms.length === 0) {
      return err('NoFarmsAvailable');
    }
    return ok(farms);
  });
  const { t } = useTranslation('farm');

  const { selectedFarm: selectedFarmId, setSelectedFarm } = useSelectedFarm();

  if (!availableFarmResult || !availableFarmResult.isOk()) {
    return null;
  }
  const availableFarms = availableFarmResult.value;
  const selectedFarm = availableFarms.find(farm => farm.id === selectedFarmId) || availableFarms[0];

  const selectFarm = (farmId: string) => {
    setSelectedFarm({ farmId });
  };


  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div
                className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                {selectedFarm?.name.charAt(0).toUpperCase()}

              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{selectedFarm?.name}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              {t('farmSwitcher.label')}
            </DropdownMenuLabel>
            {availableFarms.map((farm, index) => (
              <DropdownMenuItem
                key={farm.name}
                onClick={() => selectFarm(farm.id)}
                className="gap-2 p-2"
              >
                {farm.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
