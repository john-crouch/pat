// ABOUTME: Unit tests for rig selection dropdown functionality
// ABOUTME: Tests that rig values are preserved when dropdowns are rebuilt

import { updateRigSelects } from '../modules/rig-select';

describe('Rig Selection Dropdowns', () => {
  beforeEach(() => {
    // Set up DOM structure matching config.html
    document.body.innerHTML = `
      <div id="rigsContainer">
        <div class="rig-row">
          <input class="rig-name" value="">
          <input class="rig-network" value="">
          <input class="rig-address" value="">
        </div>
      </div>
      <select class="form-control rig-select" id="ardop_rig"></select>
      <select class="form-control rig-select" id="pactor_rig"></select>
      <select class="form-control rig-select" id="vara_hf_rig"></select>
      <select class="form-control rig-select" id="vara_fm_rig"></select>
      <select class="form-control rig-select" id="ax25_rig"></select>
    `;
  });

  test('should populate dropdown options from rig names', () => {
    // Add a rig
    $('.rig-row .rig-name').val('digirig');

    updateRigSelects($);

    const options = $('#ardop_rig option');
    expect(options.length).toBe(2);
    expect(options.eq(0).val()).toBe('');
    expect(options.eq(0).text()).toBe('None');
    expect(options.eq(1).val()).toBe('digirig');
    expect(options.eq(1).text()).toBe('digirig');
  });

  test('should preserve selected value when rebuilding dropdowns', () => {
    // Add a rig and set selection
    $('.rig-row .rig-name').val('digirig');
    updateRigSelects($);
    $('#ardop_rig').val('digirig');

    // Simulate user editing rig name (triggers updateRigSelects)
    updateRigSelects($);

    // Selection should be preserved
    expect($('#ardop_rig').val()).toBe('digirig');
  });

  test('should clear selection when selected rig is deleted', () => {
    // Add a rig and set selection
    $('.rig-row .rig-name').val('digirig');
    updateRigSelects($);
    $('#ardop_rig').val('digirig');

    // Remove the rig
    $('.rig-row .rig-name').val('');
    updateRigSelects($);

    // Selection should be cleared (to empty/None)
    expect($('#ardop_rig').val()).toBe('');
  });

  test('should handle multiple rigs', () => {
    // Set up multiple rig rows
    $('#rigsContainer').html(`
      <div class="rig-row"><input class="rig-name" value="digirig"></div>
      <div class="rig-row"><input class="rig-name" value="ft991"></div>
      <div class="rig-row"><input class="rig-name" value="ic7300"></div>
    `);

    updateRigSelects($);

    const options = $('#ardop_rig option');
    expect(options.length).toBe(4); // None + 3 rigs
    expect(options.eq(1).val()).toBe('digirig');
    expect(options.eq(2).val()).toBe('ft991');
    expect(options.eq(3).val()).toBe('ic7300');
  });

  test('should preserve different selections across multiple dropdowns', () => {
    // Set up multiple rigs
    $('#rigsContainer').html(`
      <div class="rig-row"><input class="rig-name" value="digirig"></div>
      <div class="rig-row"><input class="rig-name" value="ft991"></div>
    `);

    updateRigSelects($);

    // Set different selections
    $('#ardop_rig').val('digirig');
    $('#vara_hf_rig').val('ft991');
    $('#pactor_rig').val(''); // None

    // Rebuild dropdowns
    updateRigSelects($);

    // All selections should be preserved
    expect($('#ardop_rig').val()).toBe('digirig');
    expect($('#vara_hf_rig').val()).toBe('ft991');
    expect($('#pactor_rig').val()).toBe('');
  });

  test('should handle rig rename by clearing selection if old name gone', () => {
    // Add a rig and set selection
    $('.rig-row .rig-name').val('digirig');
    updateRigSelects($);
    $('#ardop_rig').val('digirig');

    // Rename the rig
    $('.rig-row .rig-name').val('digirig-v2');
    updateRigSelects($);

    // Selection should be cleared since 'digirig' no longer exists
    expect($('#ardop_rig').val()).toBe('');
  });

  test('should skip empty rig names', () => {
    $('#rigsContainer').html(`
      <div class="rig-row"><input class="rig-name" value="digirig"></div>
      <div class="rig-row"><input class="rig-name" value=""></div>
      <div class="rig-row"><input class="rig-name" value="ft991"></div>
    `);

    updateRigSelects($);

    const options = $('#ardop_rig option');
    expect(options.length).toBe(3); // None + 2 rigs (empty one skipped)
  });
});

describe('Config Load Order (Issue #505)', () => {
  // This test verifies the fix for issue #505:
  // Rig values must be set AFTER updateRigSelects() populates the options

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="rigsContainer"></div>
      <select class="form-control rig-select" id="vara_hf_rig"></select>
    `;
  });

  test('setting rig value before options exist should fail', () => {
    // This simulates the bug: trying to set value before options exist
    $('#vara_hf_rig').val('digirig');

    // Value won't be set because option doesn't exist
    expect($('#vara_hf_rig').val()).toBeNull();
  });

  test('correct order: populate rigs -> updateRigSelects -> set values', () => {
    // Simulate config with hamlib_rigs: { digirig: {...} } and varahf: { rig: "digirig" }
    const config = {
      hamlib_rigs: { digirig: { network: 'tcp', address: 'localhost:4532' } },
      varahf: { rig: 'digirig' }
    };

    // Step 1: Populate rig rows from config (this happens first now)
    const rigTemplate = $('<div class="rig-row"><input class="rig-name"></div>');
    Object.entries(config.hamlib_rigs).forEach(([name, rig]) => {
      const row = rigTemplate.clone();
      row.find('.rig-name').val(name);
      $('#rigsContainer').append(row);
    });

    // Step 2: Update rig selects (now has options)
    updateRigSelects($);

    // Step 3: Set the rig value (options now exist)
    $('#vara_hf_rig').val(config.varahf.rig);

    // Value should be correctly set
    expect($('#vara_hf_rig').val()).toBe('digirig');
  });
});
