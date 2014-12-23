
if (Meteor.isClient) {


    Template.Chat.helpers({

        messages: function () {
    	   return ChatMessage.find({ channel: "global" });
        },
        
        rendered: function () {
            if (!this.rendered) {

                $(".chat").resize(function () {
                    console.log("Resizing chat");
                    $(".chat-message-list").css({
                        "max-height": ($(".chat panel-body").height()-50) + "px",
                        "height": ($(".chat panel-body").height()-50) + "px"
                    });
                });
                
                this.rendered = true;
            }
        }
    });


    Template.Chat.events({
        "keypress input.chat-input": function (e) {
            if (e.which == 13 || e.keyCode == 13) {
                var msg = $(e.currentTarget).val();
                sendChatMessage({ channel: "global", message: msg });
                $(e.currentTarget).val("");
            }
        }
    });


} else {


    Meteor.methods({

        sendChatMessage: function (opts) {
            console.log("Sending message");
            console.log(opts);
            ChatMessage.insert({
                message: opts.message,
                sender: { name: getCorp().name, id: getCorp().id },
                channel: opts.channel
            });
        },


    });



}