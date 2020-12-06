import Options from './options'
import { MODIFIER_KEY } from './utils'

function save_options() {
  function get_except_urls() {
    let except_urls = []
    except_urls = $('.except_url_input').filter(function() {
      return this.value
    }).map(function() {
      return this.value
    }).get()

    return except_urls
  }

  function get_only_urls() {
    let only_urls = []
    only_urls = $('.only_url_input').filter(function() {
      return this.value
    }).map(function() {
      return this.value
    }).get()

    return only_urls
  }

  Options.except_urls(get_except_urls())
  Options.only_urls(get_only_urls())

  Options.word_key_only($('#word_key_only:checked').val() ? 1 : 0)
  Options.selection_key_only($('#selection_key_only:checked').val() ? 1 : 0)
  

  Options.delay($('#delay').val())
  Options.fontSize($('#fontSize').val())

  Options.popup_show_trigger($('#word_key_only_key').val())

  $('#status').fadeIn().delay(3000).fadeOut()
}

function populate_except_urls() {
  function add_exc_url(url) {
    let button
    const input = $('<input type="text" class="except_url_input">').attr('size', 100).val(url)
    const rm_callback = function() { $(this).closest('tr').fadeOut('fast', function() {$(this).remove()}) }

    if (url) {
      button = $('<button>', {text: 'X'}).click(rm_callback)
    }
    else {
      button = $('<button>', {text: '+'}).click(function() {
        if ($('.except_url_input', $(this).closest('tr') ).val() > '') {
          $(this).text('X').off('click').click(rm_callback)
          add_exc_url()
        }
      })
    }
    $('<tr>', {css: {display: 'none'}}).fadeIn()
      .append($('<td>').append(input))
      .append($('<td>').append(button))
      .appendTo($('#exc_urls_table'))
  }

  const saved_except_urls = Options.except_urls()

  saved_except_urls.forEach(function(url) {
    add_exc_url(url)
  })
  add_exc_url()
}


function populate_only_urls() {
  function add_only_url(url) {
    let button
    const input = $('<input type="text" class="only_url_input">').attr('size', 100).val(url)
    const rm_callback = function() { $(this).closest('tr').fadeOut('fast', function() {$(this).remove()}) }

    if (url) {
      button = $('<button>', {text: 'X'}).click(rm_callback)
    }
    else {
      button = $('<button>', {text: '+'}).click(function() {
        if ($('.only_url_input', $(this).closest('tr') ).val() > '') {
          $(this).text('X').off('click').click(rm_callback)
          add_only_url()
        }
      })
    }
    $('<tr>', {css: {display: 'none'}}).fadeIn()
      .append($('<td>').append(input))
      .append($('<td>').append(button))
      .appendTo($('#only_urls_table'))
  }

  const saved_only_urls = Options.only_urls()

  saved_only_urls.forEach(function(url) {
    add_only_url(url)
  })
  add_only_url()
}

function populate_popup_show_trigger() {
    const saved_popup_show_trigger = Options.popup_show_trigger()
  
    ;[...new Set(Object.values(MODIFIER_KEY))].forEach(function(key) {
      $('#word_key_only_key, #selection_key_only_key').each(function() {
        $(this).append($('<option>', {value: key}).text(key).prop('selected', saved_popup_show_trigger == key))
      })
    })
  
    $('#word_key_only_key, #selection_key_only_key').change(function() {
      $('#word_key_only_key, #selection_key_only_key').val(this.value)
    })
  }

$(function() {
  populate_except_urls()
  populate_only_urls()
  populate_popup_show_trigger()

  if (Options.word_key_only()) {
    $('#delay').attr('disabled', true).parent().addClass('disabled')
  }


  $('#word_key_only').attr('checked', Options.word_key_only() ? true : false).click(function() {
    if ($('#translate_by').val() == 'point' && !$(this).attr('checked')) {
      $('#delay').attr('disabled', false).parent().removeClass('disabled')
    }
    else {
      $('#delay').attr('disabled', true).parent().addClass('disabled')
    }
  })

  $('#selection_key_only').attr('checked', Options.selection_key_only() ? true : false)

  $('#delay').val(Options.delay())
  $('#fontSize').val(Options.fontSize())

  $('#save_button').click(function() { save_options() })
  $(document).on('keydown', function(e) {
    if (e.keyCode == 13) {
      save_options()
    }
  })

  $('#more_options_link').on('click', function() {
    $('#more_options_link').hide()
    $('#more_options').fadeIn()
    return false
  })

  $('.set_hotkey').on('click', function() {
    chrome.tabs.create({url:'chrome://extensions/configureCommands'})
    return false
  })
})
