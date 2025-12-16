using CuidadoConect.Models;
using CuidadoConect.Models.Usuario;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

// Si desarrollamdos una API pura, especialmente para consumir desde frontend o apps móviles:
//Usamos a modo organizativo [Route("api/[controller]")]

// Si desarrollamos algo interno, pequeño o una app híbrida (MVC + API):
//Usamos [Route("[controller]")]

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly Context _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IConfiguration _configuration;

    public AuthController(
        Context context,
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        RoleManager<IdentityRole> roleManager,
        IConfiguration configuration)
    {
        _context = context; // Contexto de la base de datos
        _userManager = userManager;// Gestor de usuarios de Identity
        _signInManager = signInManager;// Gestor de inicio de sesión de Identity
        _roleManager = roleManager;// Gestor de roles de Identity
        _configuration = configuration;// Configuración de la aplicación (appsettings.json)
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterModel model)
    {
        //CREAR ROLES SI NO EXISTEN
        var nombreRolCrearExiste = _context.Roles.Where(r => r.Name == "ADMINISTRADOR").SingleOrDefault(); //UNO O NULO
        if (nombreRolCrearExiste == null)
        {
            var roleResult = await _roleManager.CreateAsync(new IdentityRole("ADMINISTRADOR")); //CREAMOS EL ROL SI NO EXISTE
        }
        var EmpleadoRolCrearExiste = _context.Roles.Where(r => r.Name == "EMPLEADO").SingleOrDefault();
        if (EmpleadoRolCrearExiste == null)
        {
            var roleResult = await _roleManager.CreateAsync(new IdentityRole("EMPLEADO"));//CREAMOS EL ROL SI NO EXISTE
        }

        var ProfesionalRolCrearExiste = _context.Roles.Where(r => r.Name == "PROFESIONAL").SingleOrDefault();
        if (ProfesionalRolCrearExiste == null)
        {
            var roleResult = await _roleManager.CreateAsync(new IdentityRole("PROFESIONAL"));//CREAMOS EL ROL SI NO EXISTE
        }
        var familiarRolCrearExiste = _context.Roles.Where(r => r.Name == "FAMILIAR").SingleOrDefault();
        if (familiarRolCrearExiste == null)
        {
            var roleResult = await _roleManager.CreateAsync(new IdentityRole("FAMILIAR")); //CREAMOS EL ROL SI NO EXISTE
        }
        //ARMAMOS EL OBJETO COMPLETANDO LOS ATRIBUTOS COMPLETADOS POR EL USUARIO
        var user = new ApplicationUser
        {
            UserName = model.Email,
            Email = model.Email,
            NombreCompleto = model.NombreCompleto
        };

        //HACEMOS USO DEL MÉTODO REGISTRAR USUARIO
        var result = await _userManager.CreateAsync(user, model.Password);

        if (result.Succeeded) //SI SE REGISTRA CORRECTAMENTE
        {
            await _userManager.AddToRoleAsync(user, "ADMINISTRADOR"); // ASIGNAMOS UN ROL POR DEFECTO AL USUARIO
            return Ok("Usuario registrado");
        }

        return BadRequest(result.Errors);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        // 1️⃣ Buscar usuario Identity
        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user == null)
            return Unauthorized("Credenciales inválidas");

        // 2️⃣ Validar contraseña
        var passwordOk = await _userManager.CheckPasswordAsync(user, model.Password);
        if (!passwordOk)
            return Unauthorized("Credenciales inválidas");

        // 3️⃣ Obtener rol
        string rolNombre = "USUARIO";

        var rolUsuario = _context.UserRoles
            .SingleOrDefault(r => r.UserId == user.Id);

        if (rolUsuario != null)
        {
            var rol = _context.Roles
                .SingleOrDefault(r => r.Id == rolUsuario.RoleId);

            if (rol != null)
                rolNombre = rol.Name;
        }

        // 4️⃣ 🔑 ADMINISTRADOR → LOGIN DIRECTO
        if (rolNombre == "ADMINISTRADOR")
        {
            await _signInManager.SignInAsync(user, isPersistent: false);

            return Ok(new
            {
                mensaje = "Login exitoso",
                nombreCompleto = user.NombreCompleto,
                email = user.Email,
                rol = rolNombre
            });
        }

        // 5️⃣ VALIDAR PERSONA SOLO PARA ROLES OPERATIVOS
        Persona persona = null;

        var empleado = await _context.Empleado
            .Include(e => e.Persona)
            .FirstOrDefaultAsync(e => e.Email == model.Email);

        if (empleado != null)
            persona = empleado.Persona;

        if (persona == null)
        {
            var profesional = await _context.Profesional
                .Include(p => p.Persona)
                .FirstOrDefaultAsync(p => p.Email == model.Email);

            if (profesional != null)
                persona = profesional.Persona;
        }

        if (persona == null)
        {
            var residente = await _context.Residente
                .Include(r => r.Persona)
                .FirstOrDefaultAsync(r => r.EmailFamiliar == model.Email);

            if (residente != null)
                persona = residente.Persona;
        }

        if (persona == null)
            return Unauthorized("Usuario no registrado en el sistema");

        if (persona.Eliminada)
            // return Unauthorized("El usuario se encuentra deshabilitado");
            return StatusCode(403, "El usuario se encuentra deshabilitado");


        // 6️⃣ Login permitido
        await _signInManager.SignInAsync(user, isPersistent: false);

        return Ok(new
        {
            mensaje = "Login exitoso",
            nombreCompleto = persona.NombreyApellido,
            email = user.Email,
            rol = rolNombre
        });
    }




    // [HttpPost("login")]
    // public async Task<IActionResult> Login([FromBody] LoginModel model)
    // {
    //     //BUSCAMOS EL USUARIO POR MEDIO DE EMAIL EN LA BASE DE DATOS
    //     var user = await _userManager.FindByEmailAsync(model.Email);
    //     if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
    //     {
    //         string rolNombre = "EMPLEADO";
    //         //BUSCAR ROL QUE TIENE
    //         var rolUsuario = _context.UserRoles.Where(r => r.UserId == user.Id).SingleOrDefault();
    //         if (rolUsuario != null) //SI TIENE UN ROL ASIGNADO
    //         {
    //             var rol = _context.Roles.Where(r => r.Id == rolUsuario.RoleId).SingleOrDefault(); //BUSCAMOS EL ROL EN LA TABLA ROLES
    //             rolNombre = rol.Name; // OBTENEMOS EL NOMBRE DEL ROL ASIGNADO AL USUARIO
    //         }
    //         //SI EL USUARIO ES ENCONTRADO Y LA CONTRASEÑA ES CORRECTA
    //         var claims = new[]
    //         {
    //         new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()), // ID DEL USUARIO
    //         new Claim(ClaimTypes.Name, user.UserName), // USUARIO
    //         new Claim("NombreCompleto", user.NombreCompleto),// NOMBRE COMPLETO DEL USUARIO
    //         new Claim (ClaimTypes.Role, rolNombre), // ASIGNAMOS EL ROL AL USUARIO
    //         };

    //         //RECUPERAMOS LA KEY SETEADA EN EL APPSETTING
    //         // var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
    //         // var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);


    //         await _signInManager.SignInAsync(user, isPersistent: false); // esto inicia la sesión con cookie

    //         return Ok(new
    //         {
    //             mensaje = "Login exitoso",
    //             nombreCompleto = user.NombreCompleto,
    //             email = user.Email
    //         });
    //     }

    //     return Unauthorized("Credenciales inválidas");

    // }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync(); // 👈 elimina la cookie
        return Ok(new { mensaje = "Sesión cerrada correctamente" }); // 👈 devuelve JSON válido
    }

}