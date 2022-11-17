<script>
export default {
    data: function(){
        return{
            rules: {
                required: (value) => !!value || "Required.",
                counter: (value) => (value.length >= 6 || value.length == 0) || "Min 6 characters",
                counterMax: (value) => value.length <= 254 || "Max 255 characters",
                email: (value) => {
                    const pattern = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
                    return pattern.test(value) || "Invalid e-mail.";
                },
                size: (value) => {
                    if(!value) return true;
                    if(typeof(value)=='string') return false;
                    if(value.size > 10000000) 
                    return "Max 10 MB file"
                    return true;
                },
            },
        };
    },
}
</script>