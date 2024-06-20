import RoundBtn from '@/components/RoundBtn';
import { FC } from 'react';
import * as DropdownMenu from 'zeego/dropdown-menu';
import { MenuContentProps } from 'zeego/lib/typescript/menu';



const DropdownMenuRoot = DropdownMenu.Root
const DropdownMenuTrigger = DropdownMenu.Trigger
const DropdownMenuContent: any  = DropdownMenu.Content

 
const Dropdown = () => {
  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger>
      <RoundBtn icon={'ellipsis-horizontal'} text={'More'} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenu.Item key="statement">
          <DropdownMenu.ItemTitle>Statement</DropdownMenu.ItemTitle>
          <DropdownMenu.ItemIcon
            ios={{
              name: 'list.bullet.rectangle.fill',
              pointSize: 24,
            }}
            ></DropdownMenu.ItemIcon>
        </DropdownMenu.Item>

        <DropdownMenu.Item key="converter">
          <DropdownMenu.ItemTitle>Converter</DropdownMenu.ItemTitle>
          <DropdownMenu.ItemIcon
            ios={{
              name: 'coloncurrencysign.arrow.circlepath',
              pointSize: 24,
            }}></DropdownMenu.ItemIcon>
        </DropdownMenu.Item>

        <DropdownMenu.Item key="background">
          <DropdownMenu.ItemTitle>Background</DropdownMenu.ItemTitle>
          <DropdownMenu.ItemIcon
            ios={{
              name: 'photo.fill',
              pointSize: 24,
            }}></DropdownMenu.ItemIcon>
        </DropdownMenu.Item>

        <DropdownMenu.Item key="account">
          <DropdownMenu.ItemTitle>Add new account</DropdownMenu.ItemTitle>
          <DropdownMenu.ItemIcon
            ios={{
              name: 'plus.rectangle.on.folder.fill',
              pointSize: 24,
            }}></DropdownMenu.ItemIcon>
        </DropdownMenu.Item>
        </DropdownMenuContent>
        </DropdownMenuRoot>
      
  )
}

export default Dropdown

