import * as React from "react";
import { spfi, SPBrowser, } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/site-users/web";

import "@pnp/sp/items";
// import "@pnp/sp/items/get-all";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import "@pnp/sp/fields";
import "@pnp/sp/security";
import "@pnp/sp/search";
import "@pnp/sp/lists/web";
import "@pnp/sp/attachments";
import { IItem } from "@pnp/sp/items/types";
import { SPHttpClient } from '@microsoft/sp-http';


class Service {
  sp = spfi("https://webitsrb.sharepoint.com/sites/compliance/").using(SPBrowser());
  constructor() { }

  getFromList(listName: string, fields: string) {
    return this.sp.web.lists.getByTitle(listName).items.select(fields)()
  }

  makeDropdown(someArr: any) {
    let tempRes = someArr.map((sa: any) => {
      return { key: sa.ID, text: sa.Title }
    })
    return tempRes
  }


  

  deleteItem(listName: string, id: number) {
    const list = this.sp.web.lists.getByTitle(listName);
    return list.items.getById(id).delete();
  }

  getById(listName: string, id: number) {
    return this.sp.web.lists.getByTitle(listName).items.getById(id)().then(results => {
      return results;
    });
  }

  getByIdWithAtt(listName: string, id: number) {
    return this.sp.web.lists.getByTitle(listName).items.getById(id).expand("AttachmentFiles")().then(results => {
      return results;
    });
  }

  async getItemByField(listName: string, field: string, id: number) {
    return this.sp.web.lists.getByTitle(listName).items.select().filter(field + " eq " + id)().then(res => {
      return res
    })
  }

  addInList(listName: string, obj: any) {
    return this.sp.web.lists.getByTitle(listName).items.add(obj);
  }

  updateItemInList(listName: string, obj: any) {
    const list = this.sp.web.lists.getByTitle(listName);
    return list.items.getById(obj.ID).update(obj);
  }

  getFieldsFromListAndExpand(listName: string, fields: string, expandColumns: string) {
    return this.sp.web.lists.getByTitle(listName).items.select(fields).filter("Active eq 1").top(5000).expand(expandColumns)()
  }

  getFieldsFromListAndExpandAndFilterBy(listName: string, fields: string, expandColumns: string, id: number) {
    return this.sp.web.lists.getByTitle(listName).items.select(fields).filter("ContractOwner eq " + id + " and Active eq 1").top(5000).expand(expandColumns)()
  }


  getFieldsFromListAndExpandById(listName: string, fields: string, expandColumns: string, id: number) {
    return this.sp.web.lists.getByTitle(listName).items.select(fields).filter("Id eq " + id).top(5000).expand(expandColumns)()
  }

  getFieldsFromList(listName: string, fields: string) {
    return this.sp.web.lists.getByTitle(listName).items.select(fields).top(5000)()
  }

  getChoices(listName: string, fieldName: string) {
    return this.sp.web.lists.getByTitle(listName).fields.getByInternalNameOrTitle(fieldName)()
  }

  getAllUsers() {
    return this.sp.web.siteUsers()
  }

  makeDropdownFluentFromChoices(someArray: any[], makeEpty: boolean) {
    let newArr = someArray.map((el: any) => {
      return { key: el, text: el }
    })
    if (makeEpty) {
      newArr.unshift({ key: '', text: '' })
    }
    return newArr
  }

  async deleteAttacment(listName: string, id: number, fileName: string) {
    const item: IItem = this.sp.web.lists.getByTitle(listName).items.getById(id)
    await item.attachmentFiles.getByName(fileName).delete()
  }

  async addAttachment(listName: string, id: number, fileName: string, arrayb: any) {
    const item: IItem = this.sp.web.lists.getByTitle(listName).items.getById(id);
    await item.attachmentFiles.add(fileName, arrayb);
    return item
  }

  async getUserGroups() {
    return this.sp.web.currentUser.groups()
  }

  async getCurrentUser() {
    return this.sp.web.currentUser();
  }

  async getAllFiles(someArr: any[], listName: string, id: number) {
    const files = await Promise.all(
      someArr.map(async attachment => {
        const item: IItem = this.sp.web.lists.getByTitle(listName).items.getById(id);
        const blob = await item.attachmentFiles.getByName(attachment.FileName).getBlob();
        return { data: blob, name: attachment.FileName };
      })
    );
    return files
  }

  async getContractChildren(listName: string, fields: string, expandColumns: string, id: number) {
    return this.sp.web.lists.getByTitle(listName).items.select(fields).filter("ParentContractId eq " + id).top(5000).expand(expandColumns)()
  }

  makeSuccesTostify = () => {
    return {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    }
  }


}

export default Service;