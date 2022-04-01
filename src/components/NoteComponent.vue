<script setup>

import {TrashCan, DotsVertical, Pencil, Pin, PinOff} from "mdue"
import { ref } from "vue";
import { onClickOutside } from "@vueuse/core";
import { useNotesStore } from "../store/note";
import DisplayTodoComponent from "./DisplayTodoComponent.vue";
const props = defineProps({
  note: Object,
});

//initializations
let showMenu = ref(false);
const noteWrap = ref(null);
//initialize store
const notesStore = useNotesStore();

//methods
onClickOutside(noteWrap, () => {
  showMenu.value = false;
});

const setSelectedNoteAndOpenNotepad = () => {

  notesStore.setSelectedNote(props.note);
  notesStore.openNotepad(props.note.note_type);
};

const pinNote = () => {
  notesStore.togglePinNote(props.note.id).then(() => {
    showMenu.value = false;
  });
};

const deleteNote = () => {
  notesStore.deleteNote(props.note.id).then(() => {
    showMenu.value = false;
  });
};
</script>
<template>
  <div ref="noteWrap">
    <button
      class="absolute top-2 right-1"
      @click.prevent="showMenu = !showMenu">
      <DotsVertical class="w-4 h-4" />
    </button>

    <div
      v-if="showMenu"
      class="popup-menu"
      aria-orientation="vertical"
      aria-labelledby="menu-button"
      tabindex="-1"
    >
      <div class="py-1" role="none">
        <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" -->
        <button
          class="dropdown-link"
          role="menuitem"
          tabindex="-1"
          id="menu-item-0"
          @click="setSelectedNoteAndOpenNotepad"
        >
          <Pencil class="w-4 h-4" /> Edit Note
        </button>

        <button
          class="dropdown-link"
          role="menuitem"
          tabindex="-1"
          id="menu-item-0"
          @click="pinNote"
        >

        <template v-if="note.pinned">
          <PinOff class="w-4 h-4" /> Remove Pin
        </template>
         

        <template v-else>
          <Pin class="w-4 h-4" /> Pin Note
        </template>



        </button>

        <button
          class="dropdown-link"
          role="menuitem"
          tabindex="-1"
          id="menu-item-0"
          @click="deleteNote"
        >
          <TrashCan class="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>

    <div>
      <p class="text-xl font-bold">{{ note.title }}</p>
      <template v-if="note.note_type === 'note'">
        <p class="line-clamp-10">{{ note.content }}</p>
      </template>

      <div v-if="note.note_type === 'todo'" class="overflow-hidden h-32">
        <DisplayTodoComponent :noteContent="note.content" />
      </div>
    </div>
  </div>
</template>