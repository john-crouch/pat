// ABOUTME: Rig selection dropdown management module
// ABOUTME: Handles populating and preserving rig selections in config UI

/**
 * Updates all rig selection dropdowns with current rig names.
 * Preserves existing selections if the rig still exists.
 *
 * @param {jQuery} $ - jQuery instance (for testability)
 */
export function updateRigSelects($) {
  const rigNames = [];
  $('.rig-row .rig-name').each(function() {
    const name = $(this).val();
    if (name) rigNames.push(name);
  });

  $('.rig-select').each(function() {
    const currentVal = $(this).val(); // Preserve current selection
    $(this).empty().append($('<option>').val('').text('None'));
    rigNames.forEach(name => {
      $(this).append($('<option>').val(name).text(name));
    });
    // Restore selection if the rig still exists, otherwise keep empty
    if (currentVal && rigNames.includes(currentVal)) {
      $(this).val(currentVal);
    }
  });
}
