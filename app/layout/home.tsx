import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '~/components/ui/sidebar';
import { BookOpen, User, LogOut } from 'lucide-react';
import * as React from 'react';
import { authClient } from '~/lib/auth-client';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';

import type { Route } from './+types/home';
import { href, Link, Outlet, useNavigate, useRevalidator } from 'react-router';
import { useAvailableFarms } from '~/modules/farm/hooks/use-available-farms';
import { CreateFarm } from '~/components/farm/create-farm';
import { FarmSwitcher } from '~/components/common/farm-switcher';
import { MaxWidth } from '~/components/ui/max-width';
import { useTranslation } from 'react-i18next';
import { AgrosmartIcon } from '~/components/icons/agrosmart-icon';

export const loader = async ({ context }: Route.LoaderArgs) => {
  const user = context.requireUser();
  return { user: user.data };


};

const HomeLayout = ({ loaderData }: Route.ComponentProps) => {
  const availableFarms = useAvailableFarms();
  const mustCreateFarm = !!availableFarms && availableFarms.isOk() && availableFarms.value.length === 0;
  const { user } = loaderData;
  const { t } = useTranslation('common');
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await authClient.signOut();
    navigate("/login")
  }


  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <FarmSwitcher />
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to={href('/pasture-journal')}>
                      <BookOpen />
                      <span>{t('navigation.pastureJournal')}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <Popover>
                <PopoverTrigger asChild>
                  <SidebarMenuButton size="lg">
                    <div
                      className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <User className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user.name}</span>
                      <span className={'text-xs text-muted-foreground'}>{user.email}</span>
                    </div>
                  </SidebarMenuButton>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2">
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="size-4" />
                    <span>Logout</span>
                  </button>
                </PopoverContent>
              </Popover>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Link to={"/"} className="flex items-center gap-2">
            <h2 className="text-lg font-medium">AgroSmart</h2>
          </Link>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4">
          <MaxWidth>
            {mustCreateFarm && <CreateFarm open={true} />}
            <Outlet />
          </MaxWidth>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default HomeLayout;