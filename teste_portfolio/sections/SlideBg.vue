<script setup lang="ts">
// Camadas decorativas de fundo, iguais em todos os slides.
// As classes vivem em deck.css (globais) para não duplicar CSS por seção.
defineProps({
  third: { type: Boolean, default: false }, // liga o terceiro blob (terracota)
})
</script>

<template>
  <div class="sbg" aria-hidden="true">
    <span class="sbg-blob sbg-blob--a" data-depth="5" />
    <span class="sbg-blob sbg-blob--b" data-depth="8" />
    <span v-if="third" class="sbg-blob sbg-blob--c" data-depth="11" />
    <span class="sbg-grid" />
    <span class="sbg-noise" />
  </div>
</template>
